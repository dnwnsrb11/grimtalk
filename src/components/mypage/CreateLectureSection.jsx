import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { _axiosAuth } from '@/api/instance';

export const CreateLectureSection = () => {
  // 강의 정보 상태
  const [lecture, setLecture] = useState({
    subject: '',
    intro: '',
    bannerImage: '',
    selectedFile: null,
    category: '',
    tags: [],
  });

  const [curriculumForm, setCurriculumForm] = useState({
    curriculumSubject: '',
    curriculumContent: '',
    date: '',
    time: '',
  });

  const [curriculums, setCurriculums] = useState([]); // 여러 개의 커리큘럼 리스트
  const [tagInput, setTagInput] = useState(''); // 태그 입력값

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
      alert('모든 커리큘럼 필드를 입력해주세요.');

      return;
    }

    setCurriculums([...curriculums, { id: Date.now(), ...curriculumForm }]);
    setCurriculumForm({ curriculumSubject: '', curriculumContent: '', date: '', time: '' }); // 폼 초기화
  };

  // 커리큘럼 삭제
  const handleDeleteCurriculum = (id) => {
    setCurriculums(curriculums.filter((curriculum) => curriculum.id !== id));
  };

  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setLecture({
      ...lecture,
      tags: [...lecture.tags, { id: Date.now(), text: tagInput.trim() }],
    });
    setTagInput('');
  };

  // 태그 삭제
  const handleDeleteTag = (tagId) => {
    setLecture({
      ...lecture,
      tags: lecture.tags.filter((tag) => tag.id !== tagId),
    });
  };

  // 태그 입력에서 Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 강의 생성 요청
  const createLectureMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await _axiosAuth.post(`/lecture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: (data) => {
      alert('강의가 성공적으로 생성되었습니다!');
      window.location.reload();
    },
    onError: (error) => {
      alert('강의 생성에 실패했습니다.');
    },
  });

  // 강의 생성 제출
  const handleSubmit = async () => {
    if (!lecture.subject || !lecture.intro || !lecture.selectedFile || curriculums.length === 0) {
      alert('모든 필드를 입력해주세요. 최소 1개 이상의 커리큘럼이 필요합니다.');
      return;
    }

    const formData = new FormData();

    // 기본 정보
    formData.append('subject', lecture.subject);
    formData.append('intro', lecture.intro);
    formData.append('category', lecture.category);

    // 이미지 파일
    formData.append('bannerImage', lecture.selectedFile);

    // 커리큘럼 정보
    curriculums.forEach((item, index) => {
      formData.append(`curriculum[${index}].curriculumSubject`, item.curriculumSubject);
      formData.append(`curriculum[${index}].curriculumContent`, item.curriculumContent);
      formData.append(`curriculum[${index}].liveTime`, `${item.date}T${item.time}`); // 날짜와 시간 결합
    });

    // 해시태그
    lecture.tags.forEach((tag, index) => {
      formData.append(`hashtags[${index}]`, tag.text);
    });

    createLectureMutation.mutate(formData);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 강의 제목 입력 섹션 */}
      <div>
        <input
          type="text"
          value={lecture.subject}
          onChange={(e) => setLecture({ ...lecture, subject: e.target.value })}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="강의 제목을 입력해주세요."
        />
      </div>

      {/* 커리큘럼 입력 폼 섹션 */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-bold">커리큘럼 작성</label>
        <input
          type="text"
          value={curriculumForm.curriculumSubject}
          onChange={(e) =>
            setCurriculumForm({ ...curriculumForm, curriculumSubject: e.target.value })
          }
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="커리큘럼 제목을 입력해주세요."
        />
        <textarea
          value={curriculumForm.curriculumContent}
          onChange={(e) =>
            setCurriculumForm({ ...curriculumForm, curriculumContent: e.target.value })
          }
          className="h-32 resize-none rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="커리큘럼 내용을 작성해주세요."
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={curriculumForm.date}
            onChange={(e) => setCurriculumForm({ ...curriculumForm, date: e.target.value })}
            className="rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
          />

          <input
            type="time"
            value={curriculumForm.time}
            onChange={(e) => setCurriculumForm({ ...curriculumForm, time: e.target.value })}
            className="rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
          />
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
            key={curriculum.id}
            className="rounded-[20px] border border-[#000000] border-opacity-20 p-5"
          >
            <h3 className="text-lg font-bold">{curriculum.curriculumSubject}</h3>
            <p className="mt-2 whitespace-pre-wrap text-common-font-color">
              {curriculum.curriculumContent}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="inline-block rounded-3xl border bg-bg-gray-color px-3 py-1 text-sm text-text-gray-color">
                {curriculum.date}T{curriculum.time}
              </span>
              <button
                className="rounded-md bg-bg-gray-color px-3 py-2 text-sm text-common-font-color hover:bg-red-100"
                onClick={() => handleDeleteCurriculum(curriculum.id)}
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
          onChange={(e) => setLecture({ ...lecture, intro: e.target.value })}
          className="min-h-[300px] w-full resize-none rounded-[20px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
        />
      </div>

      {/* 배너 이미지 업로드 섹션 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">배너 이미지</label>
          <div className="grid grid-cols-8 gap-6">
            <input
              type="text"
              disabled
              className="col-span-7 rounded-md border border-black border-opacity-20 bg-[#E6E6E6] px-5 py-3 text-[18px] text-text-gray-color"
              value={lecture.bannerImage}
              placeholder="이미지를 선택해주세요"
            />
            <button
              onClick={handleImageSelect}
              className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white"
            >
              이미지 찾기
            </button>
          </div>
        </div>

        {/* 태그 입력 섹션 */}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold">태그 생성</p>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="rounded-md border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
            placeholder="태그를 입력 후 추가하기 혹은 엔터를 눌러주세요."
          />
          <div className="flex justify-end">
            <button
              onClick={handleAddTag}
              className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-primary-color hover:text-white"
            >
              추가하기
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {lecture.tags.length === 0 ? (
              <div className="h-6"></div>
            ) : (
              lecture.tags.map((tag) => (
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
        </div>

        {/* 카테고리 선택 */}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold">카테고리 선택</p>
          <select
            className="w-full rounded-md border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal text-text-gray-color"
            value={lecture.category}
            onChange={(e) => setLecture({ ...lecture, category: e.target.value })}
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
      </div>

      <hr className="border-divider-color" />

      {/* 제출 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-full rounded-md bg-primary-color px-5 py-3 text-lg font-semibold text-white hover:bg-primary-color/80"
        >
          강의 생성
        </button>
      </div>
    </div>
  );
};
