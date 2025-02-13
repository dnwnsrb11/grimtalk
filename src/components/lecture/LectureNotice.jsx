import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { _axios } from '@/api/instance';
import { LoadingComponents } from '@/components/common/LoadingComponents';
import { LectureCreateWrite } from '@/components/lecture/notice/LectureCreateWrite';
import { LectureNoticeCard } from '@/components/lecture/notice/LectureNoticeCard';
import { LectureNoticeDetail } from '@/components/lecture/notice/LectureNoticeDetail';

export const LectureNotice = ({ checkInstructor, lecture }) => {
  // 상세페이지 기능 구현
  const [noticeDate, setNoticeDate] = useState(null);
  const [isActive, setIsActive] = useState('/');

  const navigate = useNavigate();
  // api 연결
  const {
    data: notices,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['notices', isActive],
    queryFn: async () => {
      const { data } = await _axios.get(`/notice/${lecture.lectureId}`);
      return data.body.data.list;
    },
    onError: () => {
      navigate('/notfound');
    },
  });

  // 작성 공지사항
  const [createNoticeDate, setCreateNoticeDate] = useState('');
  // 상세페이지, 공지사항 작성페이지
  const pageComponents = {
    '공지사항 상세페이지': (
      <LectureNoticeDetail noticeDate={noticeDate} setIsActive={setIsActive} />
    ),
    '공지사항 작성페이지': <LectureCreateWrite />,
  };
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      setIsActive('/');
    };
    if (isActive) {
      // popstate 이벤트 리스너 등록
      window.addEventListener('popstate', handlePopState);

      // 초기 상태로 히스토리를 추가하여 뒤로가기 기능을 막음
      // 이를 통해 뒤로가기 버튼을 클릭하면 isActive 값만 변경됨
      history.pushState(null, document.title);
    } else {
      // isActive가 false일 때는 popstate 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
    }
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive]);

  if (isActive === '공지사항 상세페이지') {
    return <LectureNoticeDetail noticeDate={noticeDate} setIsActive={setIsActive} />;
  } else if (isActive === '공지사항 작성페이지') {
    return (
      <LectureCreateWrite
        setIsActive={setIsActive}
        setCreateNoticeDate={setCreateNoticeDate}
        lecture={lecture}
      />
    );
  }
  if (isLoading) {
    return <LoadingComponents />;
  }
  return (
    <>
      <div className="mt-[60px]">
        <div className="mb-[20px] flex gap-6">
          <h1 className="text-[32px] font-bold">공지사항</h1>
          {checkInstructor && (
            <div className="rounded-2xl border bg-primary-color px-[15px] py-[10px]">
              <button onClick={() => setIsActive('공지사항 작성페이지')}>
                <p className="text-[18px] font-semibold text-white">공지사항 작성</p>
              </button>
            </div>
          )}
        </div>
        <hr className="border border-divider-color" />
        {/* 공지사항 내용 */}
        <div className="mt-[40px]">
          {notices && notices.length > 0 ? (
            notices.map((notice, index) => (
              <div
                key={index}
                className="mb-3"
                onClick={() => {
                  setIsActive('공지사항 상세페이지');
                  setNoticeDate(notice);
                }}
              >
                <LectureNoticeCard notice={notice} />
              </div>
            ))
          ) : (
            <p className="m-[200px] py-4 text-center text-lg text-gray-500">
              등록된 공지사항이 없습니다.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
