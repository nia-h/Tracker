const generateTimePickers = n => {
  let content = [];
  for (let i = 1; i <= n; i++) {
    content.push(
      <input
        id={`timepicker-${i}`}
        key={`timepicker-${i}`}
        onBlur={e => handleTimePicker(e)}
        type='time'></input>
    );
  }
  return <div>content</div>;
};

//return <ul>{getAnimalsContent(animals)}</ul>;
