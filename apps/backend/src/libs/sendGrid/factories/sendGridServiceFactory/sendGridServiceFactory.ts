import { type HttpService } from '../../../httpService/services/httpService/httpService.js';
import { type SendGridService } from '../../services/sendGridService/sendGridService.js';
import { SendGridServiceImpl } from '../../services/sendGridService/sendGridServiceImpl.js';
import { type SendGridConfig } from '../../types/sendGridConfig.js';

export class SendGridServiceFactory {
  public constructor(private readonly httpService: HttpService) {}

  public create(config: SendGridConfig): SendGridService {
    return new SendGridServiceImpl(this.httpService, config);
  }
}
