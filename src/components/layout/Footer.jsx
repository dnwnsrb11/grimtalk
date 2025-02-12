import { FooterIcon } from '@/components/common/icons';
export const Footer = () => {
  return (
    <div className="mb-[21px]">
      <div className="mt-[21px] border-t bg-gray-border-color"></div>
      <div className="flex flex-col items-center justify-center">
        <div>
          <FooterIcon className="h-[132px] w-[194px]" />
        </div>
        <div className="mt-[15px] text-[#7A7A7A]">© 2025 Grimtalk. All rights reserved.</div>
      </div>
    </div>
  );
};
