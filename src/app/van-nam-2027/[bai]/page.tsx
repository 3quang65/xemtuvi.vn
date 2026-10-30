import { BaiDoc, metaBai, thamSo } from '@/components/BaiDoc';

export const dynamicParams = false;
export const generateStaticParams = thamSo('van-nam-2027', 'bai');
export const generateMetadata = async ({ params }: { params: Promise<{ bai: string }> }) => metaBai('van-nam-2027', (await params).bai);
export default async function Trang({ params }: { params: Promise<{ bai: string }> }) {
  return <BaiDoc nhom="van-nam-2027" ma={(await params).bai} />;
}
