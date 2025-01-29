import { useState } from 'react';

export const CreateLectureSection = () => {
  const initialCurriculumState = {
    title: '',
    description: '',
    date: '',
    time: '',
  };
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureContent, setLectureContent] = useState('');
  const [BannerImage, setBannerImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [curriculums, setCurriculums] = useState([]);
  const [curriculumForm, setCurriculumForm] = useState(initialCurriculumState);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const handleImageSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        setBannerImage(file.name);
      }
    };
    input.click();
  };

  const handleAddCurriculum = () => {
    if (
      !curriculumForm.title ||
      !curriculumForm.description ||
      !curriculumForm.date ||
      !curriculumForm.time
    ) {
      alert('모든 커리큘럼 필드를 입력해주세요.');
      return;
    }

    const newCurriculum = {
      id: Date.now(),
      ...curriculumForm,
    };

    setCurriculums([...curriculums, newCurriculum]);
    setCurriculumForm(initialCurriculumState);
  };

  const handleDeleteCurriculum = (id) => {
    setCurriculums(curriculums.filter((curriculum) => curriculum.id !== id));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, { id: Date.now(), text: tagInput.trim() }]);
    setTagInput('');
  };

  const handleDeleteTag = (tagId) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async () => {
    if (!lectureTitle || !lectureContent || !selectedFile || curriculums.length === 0) {
      alert('모든 필드를 입력해주세요. 최소 1개 이상의 커리큘럼이 필요합니다.');
      return;
    }

    try {
      // API 호출 로직 추가 예정
      console.log('강의 생성 완료', {
        lectureTitle,
        lectureContent,
        selectedFile,
        curriculums,
      });
    } catch (error) {
      console.error('강의 생성 실패:', error);
      alert('강의 생성에 실패했습니다.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="강의 제목을 입력해주세요."
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-xl font-bold">커리큘럼 작성</label>
        <input
          type="text"
          value={curriculumForm.title}
          onChange={(e) => setCurriculumForm({ ...curriculumForm, title: e.target.value })}
          className="w-full rounded-[10px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal placeholder:font-semibold"
          placeholder="커리큘럼 제목을 입력해주세요."
        />
        <textarea
          value={curriculumForm.description}
          onChange={(e) => setCurriculumForm({ ...curriculumForm, description: e.target.value })}
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

      <div className="grid grid-cols-1 gap-3">
        {curriculums.map((curriculum) => (
          <div
            key={curriculum.id}
            className="rounded-[20px] border border-[#000000] border-opacity-20 p-5"
          >
            <h3 className="text-lg font-bold">{curriculum.title}</h3>
            <div className="flex items-center justify-between">
              <p className="mt-2 w-[70%] whitespace-pre-wrap break-words text-common-font-color">
                {curriculum.description}
              </p>
              <button
                className="rounded-md bg-bg-gray-color px-3 py-2 text-sm text-common-font-color hover:bg-red-100"
                onClick={() => handleDeleteCurriculum(curriculum.id)}
              >
                삭제
              </button>
            </div>
            <div className="mt-2">
              <span className="inline-block rounded-3xl border bg-bg-gray-color px-3 py-1 text-sm text-text-gray-color">
                {curriculum.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xl font-bold">강의 내용</p>
        <textarea
          value={lectureContent}
          onChange={(e) => setLectureContent(e.target.value)}
          className="min-h-[300px] w-full resize-none rounded-[20px] border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold">배너 이미지</label>
          <div className="grid grid-cols-8 gap-6">
            <input
              type="text"
              disabled
              className="col-span-7 rounded-md border border-black border-opacity-20 bg-[#E6E6E6] px-5 py-3 text-[18px] text-text-gray-color"
              value={BannerImage}
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
            {tags.length === 0 ? (
              <div className="h-6"></div>
            ) : (
              tags.map((tag) => (
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

        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold">카테고리 선택</p>
          <select className="w-full rounded-md border border-black border-opacity-20 px-5 py-3 text-[18px] font-normal text-text-gray-color">
            <option value="" disabled selected>
              옵션에서 카테고리를 선택하세요.
            </option>
            <option value="1">카테고리 1</option>
            <option value="2">카테고리 2</option>
            <option value="3">카테고리 3</option>
          </select>
        </div>
      </div>

      <hr className="border-divider-color" />

      <div className="flex justify-end gap-6">
        <button className="rounded-md bg-bg-gray-color px-4 py-2 text-sm font-semibold text-common-font-color hover:bg-bg-gray-color/60">
          뒤로가기
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-md bg-primary-color px-4 py-2 text-sm font-semibold text-white hover:bg-primary-color/80"
        >
          생성하기
        </button>
      </div>
    </div>
  );
};
