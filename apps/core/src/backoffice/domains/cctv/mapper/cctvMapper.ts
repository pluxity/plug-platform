import { CctvResponse } from '@plug/common-services';
import { CctvData } from '../types/cctv';

export const CctvMapper = (cctv: CctvResponse): CctvData => ({
    id: cctv.id,
    name: cctv.name,
    url: cctv.url,
}); 