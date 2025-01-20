import { Test, TestingModule } from '@nestjs/testing';
import { CommonConfigService } from '@libs/common';
import { InteractionService } from '../../interactions';
import { GovernanceCreateProposalRequest } from '@libs/entities/governance.create.proposal.request';
// eslint-disable-next-line no-restricted-imports
import { ViewService } from '@libs/services/view';
import { GovernanceConfig } from '@libs/entities';

describe('InteractionService', () => {
  let service: InteractionService;
  let viewService: ViewService;

  const mockCommonConfigService = {
    config: {
      governance: {
        contractAddress: 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrlllsrujgla',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InteractionService,
        {
          provide: CommonConfigService,
          useValue: mockCommonConfigService,
        },
        {
          provide: ViewService,
          useValue: {
            getGovernanceConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InteractionService>(InteractionService);
    viewService = module.get<ViewService>(ViewService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProposal', () => {
    it('should return transaction details for a proposal creation request',  async() => {
      const request = new GovernanceCreateProposalRequest({
        sender: 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th',
        commitHash: '54bce4bb3ac2cb0d38aa265c9a9fd05b8680bedd',
        startEpoch: 10,
        endEpoch: 11,
      });

      jest.spyOn(viewService, 'getGovernanceConfig').mockResolvedValue(new GovernanceConfig({proposalFee: '1'}));
      const transaction = await service.createProposal(request);
      expect(transaction).toMatchObject({
        'sender': 'erd1qyu5wthldzr8wx5c9ucg8kjagg0jfs53s8nr3zpz3hypefsdd8ssycr6th',
        'receiver': 'erd1qqqqqqqqqqqqqqqpqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqrlllsrujgla',
        'gasPrice': 1000000000,
        'gasLimit': 100000000,
        'data': 'cHJvcG9zYWxAMzUzNDYyNjM2NTM0NjI2MjMzNjE2MzMyNjM2MjMwNjQzMzM4NjE2MTMyMzYzNTYzMzk2MTM5NjY2NDMwMzU2MjM4MzYzODMwNjI2NTY0NjRAMGFAMGI=',
      });
    });
  });
});
