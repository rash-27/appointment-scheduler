export function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${hours}:${minutes}:${seconds}`;   
}


export function formatDate(date:Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();   


  return `${day}-${month}-${year}`;
}

export function isDatesEqual(date1 : Date, date2:Date) {
  return date1.getTime() === date2.getTime();
} 
