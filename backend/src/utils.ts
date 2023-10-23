const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const getExistingRanges = (messages) => {
  const ranges = [];
  messages.forEach((message) => {
    message.timing?.forEach((timing) => {
      ranges.push([timing.startDate, timing.endDate]);
    });
  });
  return ranges;
};

const currentDateToFormat = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const checkTimeConflict = (startDate, endDate, messages) => {
  const startMinutes = timeToMinutes(startDate);
  const endMinutes = timeToMinutes(endDate);

  if (startMinutes >= endMinutes) {
    throw new Error('Start date must be before end date');
  }

  if (startDate <= currentDateToFormat()) {
    throw new Error('Start date must be after current date');
  }

  const ranges = getExistingRanges(messages);

  for (const range of ranges) {
    const [rangeStart, rangeEnd] = range.map(timeToMinutes);

    if (
      (startMinutes >= rangeStart && startMinutes < rangeEnd) ||
      (endMinutes > rangeStart && endMinutes <= rangeEnd) ||
      (startMinutes <= rangeStart && endMinutes >= rangeEnd)
    ) {
      return true;
    }
  }

  return false;
};
