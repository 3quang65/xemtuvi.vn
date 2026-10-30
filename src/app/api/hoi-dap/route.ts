import { layMayChu } from '@/lib/may-chu/csdl';
import * as x from '@/lib/may-chu/xu-ly';

export const dynamic = 'force-dynamic';

export const GET = (r: Request) => x.hoiDapDoc(r, layMayChu());
export const POST = (r: Request) => x.hoiDapGhi(r, layMayChu());
