import { BaiDoc, metaBai, thamSo } from '@/components/BaiDoc';

export const dynamicParams = false;
export const generateStaticParams = thamSo('chu-de', 'ma');
export const generateMetadata = async ({ params }: { params: Promise<{ ma: string }> }) => metaBai('chu-de', (await params).ma);
export default async function Trang({ params }: { params: Promise<{ ma: string }> }) {
  return <BaiDoc nhom="chu-de" ma={(await params).ma} />;
}
