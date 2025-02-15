import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { _axiosAuth } from '@/api/instance';

const MAX_LENGTH = 255;
const MAX_TAGS_LENGTH = 255;

export const CreateLectureSection = ({ userDataId, onBack }) => {
  const [selectDate, setSelectDate] = useState(false);
  const [lecture, setLecture] = useState({
    subject: '',
    intro: '',
    bannerImage: '',
    selectedFile: null,
    category: '',
    hashtags: [], // tags를 hashtags로 변경
  });

  const [curriculumForm, setCurriculumForm] = useState({
    curriculumSubject: '',
    curriculumContent: '',
    date: '',
    time: '',
  });

  const [curriculums, setCurriculums] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // 입력 값 validation 함수
  const validateInput = (value, maxLength = MAX_LENGTH) => {
    return value.length <= maxLength;
  };

  // 태그 validation 함수
  const validateTags = (tags, newTag = '') => {
    const totalLength = tags.reduce((acc, tag) => acc + tag.text.length, 0) + newTag.length;
    return totalLength <= MAX_TAGS_LENGTH;
  };
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
      toast.error('커리큘럼 제목은 255자를 초과할 수 없습니다.');
      return;
    }

    if (!validateInput(curriculumForm.curriculumContent)) {
      toast.error('커리큘럼 내용은 255자를 초과할 수 없습니다.');
      return;
    }

    setCurriculums([...curriculums, { id: Date.now(), ...curriculumForm }]);
    setCurriculumForm({ curriculumSubject: '', curriculumContent: '', date: '', time: '' });
    toast.success('커리큘럼이 추가되었습니다.');
  };

  // 커리큘럼 삭제
  const handleDeleteCurriculum = (id) => {
    setCurriculums(curriculums.filter((curriculum) => curriculum.id !== id));
    toast.success('커리큘럼이 삭제되었습니다.');
  };

  // 태그 추가
  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    if (!validateInput(tagInput.trim())) {
      toast.error('태그는 255자를 초과할 수 없습니다.');
      return;
    }

    // if (!validateTags(lecture.hashtags, tagInput.trim())) {
    //   // tags를 hashtags로 변경
    //   toast.error('전체 태그의 길이가 255자를 초과할 수 없습니다.');
    //   return;
    // }

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
      console.log(data);
      onBack();
    },
    onError: (error) => {
      alert('강의 생성에 실패했습니다.');
    },
  });

  // 강의 생성 제출
  const handleSubmit = async () => {
    if (!lecture.subject || !lecture.intro || !lecture.selectedFile || curriculums.length === 0) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const formData = new FormData();

    // 기본 정보
    formData.append('subject', lecture.subject);
    formData.append('intro', lecture.intro);
    formData.append('category', lecture.category);

    // 이미지 파일
    formData.append('imgUrl', lecture.selectedFile);

    // 커리큘럼 정보
    curriculums.forEach((item, index) => {
      formData.append(`curriculum[${index}].curriculumSubject`, item.curriculumSubject);
      formData.append(`curriculum[${index}].curriculumContent`, item.curriculumContent);
      formData.append(`curriculum[${index}].liveTime`, `${item.date}T${item.time}`); // 날짜와 시간 결합
    });

    // 해시태그
    if (lecture.hashtags) {
      lecture.hashtags.forEach((tag, index) => {
        formData.append(`hashtags[${index}]`, tag.text);
      });
    } else if (!lecture.tags) {
      alert('해시태그를 선택하세요.');
      return;
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    console.log(formData);

    createLectureMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    if (!validateInput(value)) {
      toast.error(`입력값이 255자를 초과할 수 없습니다.`);
      return;
    }
    setLecture({ ...lecture, [field]: value });
  };

  const handleCurriculumFormChange = (field, value) => {
    if (!validateInput(value)) {
      toast.error(`입력값이 255자를 초과할 수 없습니다.`);
      return;
    }
    setCurriculumForm({ ...curriculumForm, [field]: value });
  };
  return (
    <div className="flex w-full flex-col gap-6">
      {/* 강의 제목 입력 섹션 */}
      <div>
        <input
          type="text"
          value={lecture.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          maxLength={MAX_LENGTH}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="강의 제목을 입력해주세요."
        />
        <small className="text-gray-500">
          {lecture.subject.length}/{MAX_LENGTH}
        </small>
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
            key={curriculum.id}
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
          onChange={(e) => handleInputChange('intro', e.target.value)}
          maxLength={MAX_LENGTH}
          className="min-h-[300px] w-full resize-none rounded-[20px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
        />
        <small className="text-gray-500">
          {lecture.intro.length}/{MAX_LENGTH}
        </small>
      </div>

      {/* 배너 이미지 업로드 섹션 */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xl font-bold">배너 이미지</label>
            <p></p>
          </div>
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
            onChange={(e) => {
              // 입력 값이 255자를 초과하지 않을 때만 상태 업데이트
              if (e.target.value.length <= MAX_LENGTH) {
                setTagInput(e.target.value);
              } else {
                toast.error('태그는 255자를 초과할 수 없습니다.');
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
      <div className="flex justify-end gap-3">
        <button
          onClick={() => onBack()}
          className={`w-[110px] rounded-md bg-bg-gray-color px-5 py-3 text-lg font-semibold text-black transition-all duration-200 hover:bg-gray-300`}
        >
          뒤로가기
        </button>
        <button
          onClick={handleSubmit}
          className={`w-[110px] rounded-md px-5 py-3 text-lg font-semibold text-white ${'bg-primary-color hover:bg-primary-color/80'}`}
        >
          강의 생성
        </button>
      </div>
    </div>
  );
};
