import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { _axiosAuth } from '@/api/instance';

const MAX_LENGTH = 1000;
const MAX_LENGTH_SUBJECT = 100;

export const UpdateLectureSection = ({ onBack, updateLectureId }) => {
  // console.log(updateLectureId);
  const { lectureId } = useParams(); // URL에서 강의 ID 가져오기
  const [selectDate, setSelectDate] = useState(false);
  const [lecture, setLecture] = useState({
    subject: '',
    intro: '',
    bannerImage: '',
    selectedFile: null,
    category: '',
    hashtags: [],
  });

  const [curriculumForm, setCurriculumForm] = useState({
    curriculumSubject: '',
    curriculumContent: '',
    date: '',
    time: '',
  });

  const [curriculums, setCurriculums] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // 기존 강의 데이터 불러오기
  const { data: lectureData, isLoading } = useQuery({
    queryKey: ['lecture', updateLectureId],
    queryFn: async () => {
      const { data } = await _axiosAuth.get(`/lecture/${updateLectureId.lectureId}`);
      return data.body.data; // "data" 부분만 반환
    },
    onSuccess: (data) => {
      // 강의 정보 기본값 설정
      setLecture({
        subject: data.subject || '',
        intro: data.intro || '',
        bannerImage: data.imgUrl || '',
        category: data.category || '',
        hashtags: data.hashtags?.map((tag) => ({ id: Date.now(), text: tag })) || [],
        selectedFile: null, // 초기엔 선택된 파일 없음
      });

      // 커리큘럼 정보 기본값 설정
      setCurriculums(
        data.curriculum?.map((curr) => ({
          id: Date.now(), // 고유 ID 추가
          curriculumId: curr.curriculumId || '',
          curriculumSubject: curr.curriculumSubject || '',
          curriculumContent: curr.curriculumContent || '',
          date: curr.liveTime?.split('T')[0] || '',
          time: curr.liveTime?.split('T')[1] || '',
        })) || [],
      );
    },
    staleTime: 0,
  });
  useEffect(() => {
    if (lectureData) {
      setLecture({
        subject: lectureData.subject || '',
        intro: lectureData.intro || '',
        bannerImage: lectureData.imgUrl || '',
        category: lectureData.category || '',
        hashtags: lectureData.hashtags?.map((tag) => ({ id: Date.now(), text: tag })) || [],
        selectedFile: null,
      });

      setCurriculums(
        lectureData.curriculum?.map((curr) => ({
          id: Date.now(),
          curriculumId: curr.curriculumId || '',
          curriculumSubject: curr.curriculumSubject || '',
          curriculumContent: curr.curriculumContent || '',
          date: curr.liveTime?.split('T')[0] || '',
          time: curr.liveTime?.split('T')[1] || '',
        })) || [],
      );
    }
  }, [lectureData]);

  const validateInput = (value, maxLength = MAX_LENGTH) => {
    if (value === null || value === undefined) return false;
    const strValue = value.toString(); // 무조건 문자열로 변환

    return strValue.length + 1 < maxLength;
  };

  const validateSubjectInput = (value, maxLength = MAX_LENGTH_SUBJECT) => {
    if (value === null || value === undefined) return false;
    const strValue = value.toString(); // 무조건 문자열로 변환

    return strValue.length + 1 < maxLength;
  };

  // 강의 수정 mutation
  const updateLectureMutation = useMutation({
    mutationFn: async (formData) => {
      console.log('📌 FormData 내용 확인:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const { data } = await _axiosAuth.put(`/lecture/${updateLectureId.lectureId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success('강의가 성공적으로 수정되었습니다!');
      onBack && onBack();
    },
    onError: (error) => {
      toast.error('강의 수정에 실패했습니다.');
      console.error(error);
    },
  });

  // CreateLectureSection의 나머지 핸들러 함수들 동일하게 가져오기
  // handleImageSelect, handleAddCurriculum, handleDeleteCurriculum,
  // handleAddTag, handleDeleteTag, validateInput 등

  // 수정된 제출 핸들러
  const handleSubmit = async () => {
    if (!lecture.subject) {
      alert('강의 제목을 입력해주세요.');
      return;
    }

    if (!lecture.intro) {
      alert('강의 내용을 입력해주세요.');
      return;
    }

    if (!lecture.category || lecture.category.length === 0) {
      alert('강의 카테고리를 선택해주세요.');
      return;
    }

    if (!lecture.bannerImage) {
      alert('배너 이미지를 업로드해주세요.');
      return;
    }

    if (!lecture.hashtags || lecture.hashtags.length === 0) {
      alert('해시태그를 입력해주세요.');
      return;
    }

    if (curriculums.length === 0) {
      alert('커리큘럼을 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 기본 정보
    formData.append('subject', lecture.subject);
    formData.append('intro', lecture.intro);
    formData.append('category', lecture.category);

    // 이미지 파일이 새로 선택된 경우에만 추가
    if (lecture.selectedFile) {
      // 새로운 파일이 선택된 경우에만 파일 추가
      formData.append('imgUrl', lecture.selectedFile);
    }
    // 커리큘럼 정보
    curriculums.forEach((item, index) => {
      // curriculumId가 있고 유효한 경우에만 추가
      if (item.curriculumId && item.curriculumId !== 'undefined') {
        formData.append(`curriculum[${index}].curriculumId`, item.curriculumId);
      }
      formData.append(`curriculum[${index}].curriculumSubject`, item.curriculumSubject);
      formData.append(`curriculum[${index}].curriculumContent`, item.curriculumContent);
      formData.append(`curriculum[${index}].liveTime`, `${item.date}T${item.time}`);
    });
    // 해시태그
    lecture.hashtags.forEach((tag, index) => {
      formData.append(`hashtags[${index}]`, tag.text);
    });

    // 🛠 FormData 콘솔 출력
    // console.log('📌 FormData 내용 확인:');
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    updateLectureMutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // CreateLectureSection의 return 부분과 동일한 JSX 사용
  // 이미지 업로드 핸들러
  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setLecture({
          ...lecture,
          selectedFile: file,
          bannerImage: file.name,
        });
      }
    };
    input.click();
  };

  // 커리큘럼 추가
  const handleAddCurriculum = () => {
    if (
      !curriculumForm.curriculumSubject ||
      !curriculumForm.curriculumContent ||
      !curriculumForm.date ||
      !curriculumForm.time
    ) {
      toast.error('모든 커리큘럼 필드를 입력해주세요.');
      return;
    }

    if (!validateInput(curriculumForm.curriculumSubject)) {
      toast.error('커리큘럼 제목은 1000자를 초과할 수 없습니다.');
      return;
    }

    if (!validateInput(curriculumForm.curriculumContent)) {
      toast.error('커리큘럼 내용은 1000자를 초과할 수 없습니다.');
      return;
    }

    setCurriculums([...curriculums, { id: Date.now(), ...curriculumForm }]);
    setCurriculumForm({ curriculumSubject: '', curriculumContent: '', date: '', time: '' });
    toast.success('커리큘럼이 추가되었습니다.');
  };

  // 커리큘럼 삭제
  const handleDeleteCurriculum = (id) => {
    setCurriculums(curriculums.filter((curriculum) => curriculum.curriculumId !== id));
    toast.success('커리큘럼이 삭제되었습니다.');
  };

  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    if (!validateInput(tagInput.trim())) {
      toast.error('태그는 1000자를 초과할 수 없습니다.');
      return;
    }

    setLecture({
      ...lecture,
      hashtags: [...lecture.hashtags, { id: Date.now(), text: tagInput.trim() }], // tags를 hashtags로 변경
    });
    setTagInput('');
  };

  // 태그 삭제 핸들러 수정
  const handleDeleteTag = (tagId) => {
    setLecture({
      ...lecture,
      hashtags: lecture.hashtags.filter((tag) => tag.id !== tagId), // tags를 hashtags로 변경
    });
  };

  const handleInputChange = (field, value) => {
    const strValue = value.toString(); // 숫자도 문자열 변환하여 처리
    if (!validateInput(strValue)) {
      toast.error(`입력값이 ${MAX_LENGTH}자를 초과할 수 없습니다.`);
      return;
    }
    setLecture((prev) => ({ ...prev, [field]: strValue })); // 숫자가 아니라 문자열로 저장
  };

  const handleCurriculumFormChange = (field, value) => {
    const strValue = value.toString(); // 숫자 변환 처리
    if (!validateInput(strValue)) {
      toast.error(`입력값이 ${MAX_LENGTH}자를 초과할 수 없습니다.`);
      return;
    }
    setCurriculumForm((prev) => ({ ...prev, [field]: strValue })); // 문자열로 변환하여 저장
  };

  const handleInputSubjectChange = (field, value) => {
    const strValue = value.toString(); // 숫자도 문자열 변환하여 처리
    if (!validateSubjectInput(strValue)) {
      toast.error(`입력값이 ${MAX_LENGTH_SUBJECT}자를 초과할 수 없습니다.`);
      return;
    }
    setLecture((prev) => ({ ...prev, [field]: strValue })); // 숫자가 아니라 문자열로 저장
  };
  return (
    <div className="flex w-full flex-col gap-6">
      {/* 강의 제목 입력 섹션 */}
      <div>
        <input
          type="text"
          value={lecture.subject}
          onChange={(e) => handleInputSubjectChange('subject', e.target.value)}
          maxLength={MAX_LENGTH_SUBJECT}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="강의 제목을 입력해주세요."
        />
        <small className="text-gray-500">
          {lecture.subject.length}/{MAX_LENGTH_SUBJECT}
        </small>
        {!lecture.subject ? (
          <p className="m-0 p-0 text-primary-color">강의 제목을 입력해주세요.</p>
        ) : null}
      </div>

      {/* 커리큘럼 입력 폼 섹션 */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-bold">커리큘럼 작성</label>
        <input
          type="text"
          value={curriculumForm.curriculumSubject}
          onChange={(e) => handleCurriculumFormChange('curriculumSubject', e.target.value)}
          maxLength={MAX_LENGTH}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="커리큘럼 제목을 입력해주세요."
        />
        <small className="text-gray-500">
          {curriculumForm.curriculumSubject.length}/{MAX_LENGTH}
        </small>

        <textarea
          value={curriculumForm.curriculumContent}
          onChange={(e) => handleCurriculumFormChange('curriculumContent', e.target.value)}
          maxLength={MAX_LENGTH}
          className="h-32 resize-none rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="커리큘럼 내용을 작성해주세요."
        />
        <small className="text-gray-500">
          {curriculumForm.curriculumContent.length}/{MAX_LENGTH}
        </small>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={curriculumForm.date}
            onChange={(e) => {
              setCurriculumForm({ ...curriculumForm, date: e.target.value });
              setSelectDate(true);
            }}
            className="rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
          />

          <input
            type="time"
            value={curriculumForm.time}
            onChange={(e) => {
              setCurriculumForm({ ...curriculumForm, time: e.target.value });
              setSelectDate(true);
            }}
            className="rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {!curriculumForm.date ? (
            <p className="pl-[10px] text-primary-color">라이브 시작 날짜를 선택해주세요.</p>
          ) : (
            selectDate && (
              <p className="pl-[10px] text-green-600">라이브 시작 날짜가 설정되었습니다.</p>
            )
          )}

          {!curriculumForm.time ? (
            <p className="pl-[10px] text-primary-color">라이브 시작 시간을 선택해주세요.</p>
          ) : (
            selectDate && (
              <p className="pl-[10px] text-green-600">라이브 시작 시간이 설정되었습니다.</p>
            )
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddCurriculum}
            className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
          >
            추가하기
          </button>
        </div>
      </div>

      <hr className="border-divider-color" />

      {/* 커리큘럼 목록 표시 섹션 */}
      <div className="grid grid-cols-1 gap-3">
        {curriculums.map((curriculum) => (
          <div
            key={curriculum.curriculumId}
            className="rounded-[20px] border border-[#000000] border-opacity-20 p-5"
          >
            <p className="text-md font-semibold text-[#C6C6C6] opacity-90">커리큘럼 제목</p>

            <h3 className="text-lg font-bold">{curriculum.curriculumSubject}</h3>
            <p className="mt-2 whitespace-pre-wrap text-common-font-color">
              {curriculum.curriculumContent}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-block rounded-3xl border bg-bg-gray-color px-3 py-1 text-sm text-text-gray-color">
                {curriculum.date} {curriculum.time}
              </span>
              <button
                className="rounded-md bg-bg-gray-color px-3 py-2 text-sm text-common-font-color hover:bg-red-100"
                onClick={() => handleDeleteCurriculum(curriculum.curriculumId)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 강의 내용 입력 섹션 */}
      <div className="flex flex-col gap-3">
        <p className="text-xl font-bold">강의 내용</p>
        <textarea
          value={lecture.intro}
          onChange={(e) => handleInputChange('intro', e.target.value)}
          maxLength={MAX_LENGTH}
          className="min-h-[300px] w-full resize-none rounded-[20px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
        />
        <small className="text-gray-500">
          {lecture.intro.length}/{MAX_LENGTH}
        </small>
        {!lecture.intro ? <p className=" text-primary-color">강의 내용을 입력해주세요.</p> : null}
      </div>

      {/* 배너 이미지 업로드 섹션 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex flex-row items-center gap-3">
              <label className="text-xl font-bold">배너 이미지</label>
              <div className="relative inline-block">
                {/* ? 아이콘 (원형 버튼) */}
                <div className="group flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-gray-800">
                  ?{/* 툴팁 */}
                  <span className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded-md bg-gray-800 px-3 py-1 text-sm text-white group-hover:block">
                    배너 이미지는 1200x300px 권장
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-6">
            <input
              type="text"
              disabled
              className="col-span-7 rounded-md border border-black border-opacity-20 bg-[#E6E6E6] px-5 py-3 text-[18px] text-text-gray-color"
              value={
                lecture.bannerImage ? lecture.bannerImage.split('/').pop() : '이미지를 선택해주세요'
              }
              placeholder="이미지를 선택해주세요"
            />

            <button
              onClick={handleImageSelect}
              className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white"
            >
              이미지 찾기
            </button>
          </div>
          {!lecture.bannerImage ? (
            <p className=" text-primary-color">배너 이미지를 업로드해주세요.</p>
          ) : (
            <p className=" text-green-600">배너 이미지가 업로드되었습니다.</p>
          )}
        </div>
        {/* 태그 입력 섹션 */}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold">태그 생성</p>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              // 입력 값이 1000자를 초과하지 않을 때만 상태 업데이트
              if (e.target.value.length <= MAX_LENGTH) {
                setTagInput(e.target.value);
              } else {
                toast.error('태그는 1000자를 초과할 수 없습니다.');
              }
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            maxLength={MAX_LENGTH}
            className="rounded-md border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
            placeholder="태그를 입력 후 추가하기 혹은 엔터를 눌러주세요."
          />
          <small className="text-gray-500">
            태그 길이: {tagInput.length}/{MAX_LENGTH}
          </small>
          <div className="flex justify-end">
            <button
              onClick={handleAddTag}
              className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white"
            >
              추가하기
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lecture.hashtags.length === 0 ? (
              <div className="h-6"></div>
            ) : (
              lecture.hashtags.map((tag) => (
                <span
                  key={tag.id}
                  className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm"
                >
                  {tag.text}
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="ml-1 text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
          {lecture.hashtags.length === 0 ? (
            <p className=" text-primary-color">태그를 1개 이상 입력해주세요.</p>
          ) : null}
        </div>
        {/* 카테고리 선택 */}
        <select
          className="w-full rounded-md border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal text-text-gray-color"
          value={lecture.category}
          onChange={(e) => {
            setLecture({ ...lecture, category: e.target.value });
          }}
        >
          <option value="" disabled>
            옵션에서 카테고리를 선택하세요.
          </option>
          <option value="CHARACTER">캐릭터</option>
          <option value="EMOTICON">이모티콘</option>
          <option value="DRAWING">드로잉</option>
          <option value="COLORING">컬러링</option>
          <option value="WEBTOON">웹툰</option>
          <option value="CONCEPT_ART">컨셉 아트</option>
        </select>
      </div>

      <hr className="border-divider-color" />

      {/* 제출 버튼 */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onBack}
          className={`w-[110px] rounded-md bg-bg-gray-color px-5 py-3 text-lg font-semibold text-black transition-all duration-200 hover:bg-gray-300`}
        >
          뒤로가기
        </button>
        <button
          onClick={handleSubmit}
          className={`w-[110px] rounded-md px-5 py-3 text-lg font-semibold text-white ${'bg-primary-color hover:bg-primary-color/80'}`}
        >
          강의 수정
        </button>
      </div>
    </div>
  );
};
