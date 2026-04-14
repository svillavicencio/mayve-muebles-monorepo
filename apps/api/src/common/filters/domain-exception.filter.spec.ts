import { DomainExceptionFilter } from './domain-exception.filter';
import { CategoryNotEmptyException } from '../../products/domain/exceptions/category-not-empty.exception';

describe('DomainExceptionFilter', () => {
  let filter: DomainExceptionFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: any;

  beforeEach(() => {
    filter = new DomainExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
    };
  });

  it('returns HTTP 409 for CategoryNotEmptyException', () => {
    const exception = new CategoryNotEmptyException();
    filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(409);
  });

  it('includes statusCode 409 and the exception message in the JSON body', () => {
    const exception = new CategoryNotEmptyException();
    filter.catch(exception, mockHost);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'La categoría no puede eliminarse porque contiene productos',
    });
  });
});
