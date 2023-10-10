import { ImageIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

export const ImageElement: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <Button className="w-[100%] justify-start" variant="outline">
        <ImageIcon className="w-4.h mr-2" />
        Image
      </Button>
    </div>
  );
};
