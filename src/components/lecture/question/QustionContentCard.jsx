import posterNoneImg from '@/assets/posterNoneImg.png';

export const QuestionContentCard = ({ comment, boardId }) => {
  return (
    <div className="ml-[15px] mt-[15px] flex flex-col gap-3">
      <div className="flex flex-row">
        <img
          src={comment?.image || posterNoneImg}
          className="h-[45px] w-[45px] rounded-full bg-gray-600"
          alt=""
        />
        <div className="ml-[15px] flex flex-col">
          <div className="flex flex-row gap-3">
            <div className="text-[15px] font-bold">{comment?.nickname}</div>
            {boardId === comment?.commentCreatedMemberId ? <div>질문자</div> : null}
            {/* <div>만약 id가 같다면 질문자라고 넣어주기기</div> */}
          </div>
          <div className="text-[14px] text-[#868296]">
            {comment?.createdAt
              ? new Date(comment.createdAt).toISOString().replace('T', ' ').slice(0, 16)
              : '날짜 없음'}
          </div>
        </div>
      </div>
      <div>{comment?.content}</div>
      <hr className="mt-[15px]" />
    </div>
  );
};
