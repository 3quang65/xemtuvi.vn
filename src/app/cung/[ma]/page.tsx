import { BaiDoc, metaBai, thamSo } from '@/components/BaiDoc';

export const dynamicParams = false;
export const generateStaticParams = thamSo('cung', 'ma');
export const generateMetadata = async ({ params }: { params: Promise<{ ma: string }> }) => metaBai('cung', (await params).ma);
export default async function Trang({ params }: { params: Promise<{ ma: string }> }) {
  return <BaiDoc nhom="cung" ma={(await params).ma} />;
}
