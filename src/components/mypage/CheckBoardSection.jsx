import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';
import { CommunityList } from '@/components/mainPages/community/CommunityList';
import { QuestionDetail } from '@/components/mypage/QuestionDetail';
export const CheckBoardSection = () => {
  const [selectedBoardId, setSelectedBoardId] = useState(null); // ✅ 선택된 게시글 ID 저장

  const { data: checkBoards } = useQuery({
    queryKey: ['checkboard'],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/mypage/question`);
      return data.body.data.list;
    },
  });

  // ✅ 선택된 boardId에 해당하는 lectureId 찾기
  const selectedLectureId = checkBoards?.find(
    (board) => board.boardId === selectedBoardId,
  )?.lectureId;

  if (selectedBoardId) {
    return (
      <QuestionDetail
        boardId={selectedBoardId}
        lectureId={selectedLectureId}
        setIsActive={() => setSelectedBoardId(null)}
      />
    );
  }

  return (
    <div>
      {checkBoards && checkBoards.length > 0 ? (
        checkBoards.map((checkBoard) => (
          <CommunityList
            key={checkBoard.boardId}
            community={checkBoard}
            onClick={() => {
              console.log('질문 선택:', checkBoard.boardId);
              setSelectedBoardId(checkBoard.lectureId);
            }}
          />
        ))
      ) : (
        <p className="text-center text-gray-500">해당 내용이 없습니다.</p>
      )}
    </div>
  );
};
