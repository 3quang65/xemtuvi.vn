import { layMayChu } from '@/lib/may-chu/csdl';
import * as x from '@/lib/may-chu/xu-ly';

export const dynamic = 'force-dynamic';

export const GET = (r: Request) => x.laSoDoc(r, layMayChu());
export const POST = (r: Request) => x.laSoGhi(r, layMayChu());
