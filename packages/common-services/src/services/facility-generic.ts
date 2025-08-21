import { api } from '@plug/api-hooks';
import { DataResponseBody } from '@plug/api-hooks';
import { 
  domainUtils,
  DomainCreateRequest,
  DomainUpdateRequest,
  DomainResponse,
  FacilityType
} from '../constants/domain-config';

export class FacilityService {
  static async getAll<T extends FacilityType>(
    domain: T
  ): Promise<DataResponseBody<DomainResponse<T>[]>> {
    const config = domainUtils.getConfig(domain);
    return api.get<DomainResponse<T>[]>(config.endpoint);
  }

  static async getById<T extends FacilityType>(
    domain: T,
    id: number
  ): Promise<DataResponseBody<DomainResponse<T>>> {
    const config = domainUtils.getConfig(domain);
    return api.get<DomainResponse<T>>(`${config.endpoint}/${id}`);
  }

  static async create<T extends FacilityType>(
    domain: T,
    data: DomainCreateRequest<T>
  ): Promise<void> {
    const config = domainUtils.getConfig(domain);
    const response = await api.post(config.endpoint, data);
    if (!response.ok) {
      throw new Error(`Failed to create ${config.displayName}: ${response.status}`);
    }
  }

  static async update<T extends FacilityType>(
    domain: T,
    id: number,
    data: DomainUpdateRequest<T>
  ): Promise<void> {
    const config = domainUtils.getConfig(domain);
    return api.put(`${config.endpoint}/${id}`, data);
  }

  static async delete<T extends FacilityType>(
    domain: T,
    id: number
  ): Promise<void> {
    const config = domainUtils.getConfig(domain);
    return api.delete(`${config.endpoint}/${id}`);
  }

  static getDomainInfo<T extends FacilityType>(domain: T) {
    const config = domainUtils.getConfig(domain);
    return {
      name: domain,
      displayName: config.displayName,
      endpoint: config.endpoint,
      components: config.components
    };
  }

  static getSupportedDomains(): FacilityType[] {
    return domainUtils.getAllDomains();
  }

  static isValidDomain(domain: string): domain is FacilityType {
    return domainUtils.isValidDomain(domain);
  }
}

type DomainServiceMethods<T extends FacilityType> = {
  getAll: () => Promise<DataResponseBody<DomainResponse<T>[]>>;
  getById: (id: number) => Promise<DataResponseBody<DomainResponse<T>>>;
  create: (data: DomainCreateRequest<T>) => Promise<void>;
  update: (id: number, data: DomainUpdateRequest<T>) => Promise<void>;
  delete: (id: number) => Promise<void>;
  getDomainInfo: () => ReturnType<typeof FacilityService.getDomainInfo>;
};

function createDomainService<T extends FacilityType>(domain: T): DomainServiceMethods<T> {
  return {
    getAll: () => FacilityService.getAll(domain),
    getById: (id: number) => FacilityService.getById(domain, id),
    create: (data: DomainCreateRequest<T>) => FacilityService.create(domain, data),
    update: (id: number, data: DomainUpdateRequest<T>) => FacilityService.update(domain, id, data),
    delete: (id: number) => FacilityService.delete(domain, id),
    getDomainInfo: () => FacilityService.getDomainInfo(domain)
  };
}

export const domainServices = domainUtils.getAllDomains().reduce((services, domain) => {
  services[domain] = createDomainService(domain);
  return services;
}, {} as Record<FacilityType, DomainServiceMethods<any>>);
