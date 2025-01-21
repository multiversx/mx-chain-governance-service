// eslint-disable-next-line boundaries/no-unknown-files
import axios from 'axios';
import { fundAddress, sendTransaction } from './chain.simulator.operations';
import { TransactionDetails } from '@libs/entities';

const CHAIN_SIMULATOR_URL = 'http://localhost:8085';
const ALICE_ADDRESS = 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th';
const BOB_ADDRESS = 'erd1spyavw0956vq68xj8y4tenjpq2wd5a9p2c6j8gsz7ztyrnpxrruqzu66jx';
const GOVERNANCE_OWNER = 'erd1vxy22x0fj4zv6hktmydg8vpfh6euv02cz4yg0aaws6rrad5a5awqgqky80';
const CHAIN_GOVERNANCE_SERVICE_URL = 'http://localhost:3000';

// This should be enabled when we have an official Docker release of a chain simulator that supports chain governance
describe.skip('Chain Governance e2e tests with chain simulator', () => {
  beforeAll(async () => {
    try {
      const response = await axios.get(`${CHAIN_SIMULATOR_URL}/simulator/observers`);

      let numRetries = 0;
      while (true) {
        if (response.status === 200) {
          await axios.post(`${CHAIN_SIMULATOR_URL}/simulator/generate-blocks-until-epoch-reached/2`, {});
          break;
        }

        numRetries += 1;
        if (numRetries > 50) {
          fail('Chain simulator not started!');
        }
      }
    } catch (e) {
      console.error(e);
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test a happy flow with a proposal initialization, voting and closing', async () => {
    await fundAddress(CHAIN_SIMULATOR_URL, ALICE_ADDRESS);
    await fundAddress(CHAIN_SIMULATOR_URL, BOB_ADDRESS);
    await fundAddress(CHAIN_SIMULATOR_URL, GOVERNANCE_OWNER);

    // stake some egld
    await stake(BOB_ADDRESS);

    // move to epoch
    await axios.post(`${CHAIN_SIMULATOR_URL}/simulator/generate-blocks-until-epoch-reached/7`, {});

    // init proposal
    const initProposalResponse = await axios.post(`${CHAIN_GOVERNANCE_SERVICE_URL}/interactions/proposals`, {
      'sender': ALICE_ADDRESS,
      'commitHash': '54bce4bb3ac2cb0d38aa265c9a9fd05b8680bede',
      'startEpoch': 7,
      'endEpoch': 7,
    });
    await sendTx(initProposalResponse.data);

    // vote
    const voteResponse = await axios.post(`${CHAIN_GOVERNANCE_SERVICE_URL}/interactions/vote`, {
      'sender': BOB_ADDRESS,
      'proposalNonce': 1,
      'voteOption': 'yes',
    });
    await sendTx(voteResponse.data);

    await axios.post(`${CHAIN_SIMULATOR_URL}/simulator/generate-blocks-until-epoch-reached/8`, {});

    // close proposal
    const closeProposalResponse = await axios.post(`${CHAIN_GOVERNANCE_SERVICE_URL}/interactions/close-proposal`, {
      'sender': ALICE_ADDRESS,
      'proposalNonce': '1',
    });
    await sendTx(closeProposalResponse.data);

    // clear closed proposals
    const clearClosedProposalResponse = await axios.post(`${CHAIN_GOVERNANCE_SERVICE_URL}/interactions/clear-ended-proposals`, {
      'sender': ALICE_ADDRESS,
      'voterAddress': BOB_ADDRESS,
    });
    await sendTx(clearClosedProposalResponse.data);

    // change config
    const changeConfigResponse = await axios.post(`${CHAIN_GOVERNANCE_SERVICE_URL}/interactions/change-config`, {
      'sender': 'erd1vxy22x0fj4zv6hktmydg8vpfh6euv02cz4yg0aaws6rrad5a5awqgqky80',
      'proposalFee': '6000000000000000000',
      'lostProposalFee': '5000000000000000000',
      'minQuorum': 10000,
      'minVeto': 9000,
      'minPass': 8000,
    });
    await sendTx(changeConfigResponse.data);
  }, 100000);
});

async function sendTx(tx: TransactionDetails) {
  const txHash = await sendTransaction({
    chainSimulatorUrl: CHAIN_SIMULATOR_URL,
    sender: tx.sender as string,
    receiver: tx.receiver as string,
    gasLimit: Number(tx.gasLimit),
    dataField: tx.data as string,
    value: tx.value,
  });

  const txResult = await axios.get(`${CHAIN_SIMULATOR_URL}/transaction/${txHash}?withResults=true`);
  const signalErrorEvent = txResult.data?.data?.transaction?.logs?.events?.find((e: { identifier: string; }) => e.identifier === 'signalError');
  if (signalErrorEvent) {
    const decodedError = Buffer.from(signalErrorEvent.topics[1], 'base64');
    console.log(`Transaction ${txHash} was not executed successfully. Error: ${decodedError}`);
  }
}

async function stake(address: string) {
  await sendTx({
    sender: address,
    receiver: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqplllst77y4l',
    gasLimit: 50_000_000,
    value: '2500000000000000000000',
    data: Buffer.from('stake@01@ac7a22042a9b5eca50e6be7582856708bc3451c947f0607b4304f2ccadbc446cd4100f487984803994e5d4e81cca8e0ab7814eed458aea9d265bc7224446a793f9e1b50d5307ff1c6da9ef0c20ac3b0463914b22432f8d2ec1dbd6fcab1fc794@67656e65736973').toString('base64'),
  });
}
