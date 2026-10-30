import { BaiDoc, metaBai, thamSo } from '@/components/BaiDoc';

export const dynamicParams = false;
export const generateStaticParams = thamSo('sao', 'ma');
export const generateMetadata = async ({ params }: { params: Promise<{ ma: string }> }) => metaBai('sao', (await params).ma);
export default async function Trang({ params }: { params: Promise<{ ma: string }> }) {
  return <BaiDoc nhom="sao" ma={(await params).ma} />;
}
