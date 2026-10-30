import * as x from '@/lib/may-chu/xu-ly';

export const dynamic = 'force-dynamic';

export const POST = (r: Request) => x.webhook(r);
