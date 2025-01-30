import { useDemoStore } from '@/store/useDemoStore';

export const DemoPage = () => {
  // selector 패턴 사용
  const bears = useDemoStore((state) => state.bears);
  const increasePopulation = useDemoStore((state) => state.increasePopulation);
  const removeAllBears = useDemoStore((state) => state.removeAllBears);
  const updateBears = useDemoStore((state) => state.updateBears);

  return (
    <div className="col-span-14">
      <h1 className="text-2xl font-bold">DemoPage</h1>
      <div className="flex flex-col items-baseline gap-2">
        <p>Bears: {bears}</p>
        <button className="border border-gray-300 px-2 py-1" onClick={increasePopulation}>
          Increase Population
        </button>
        <button className="border border-gray-300 px-2 py-1" onClick={removeAllBears}>
          Remove All Bears
        </button>
        <button className="border border-gray-300 px-2 py-1" onClick={() => updateBears(bears + 1)}>
          Update Bears
        </button>
      </div>
    </div>
  );
};
