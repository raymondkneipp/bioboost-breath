export function Countdown(props: { value: number }) {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="text-8xl font-bold text-blue-900">{props.value}</div>
      <div className="text-xl mt-4 max-w-xs text-center text-balance">
        Empty your lungs and get ready to inhale...
      </div>
    </div>
  );
}
