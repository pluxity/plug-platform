import { CctvData } from '../types/cctv';

import { CctvResponse } from '@plug/common-services';
export const CctvMapper = (cctv: CctvResponse): CctvData => ({
    id: cctv.id,
    name: cctv.name,
    url: cctv.url,
}); 