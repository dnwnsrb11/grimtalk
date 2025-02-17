import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function MediaPermissionModal({ isOpen, onClose, onConfirm }) {
  const [cameraEnabled, setCameraEnabled] = React.useState(true);
  const [micEnabled, setMicEnabled] = React.useState(true);

  const handleConfirm = () => {
    onConfirm({ camera: cameraEnabled, microphone: micEnabled });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>미디어 권한 설정</DialogTitle>
          <DialogDescription>화상 통화에 사용할 장치를 선택해주세요.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="camera"
              checked={cameraEnabled}
              onChange={(e) => setCameraEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="camera">카메라 사용</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="microphone"
              checked={micEnabled}
              onChange={(e) => setMicEnabled(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="microphone">마이크 사용</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleConfirm}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
