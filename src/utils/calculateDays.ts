export const getDaysAgo = (dateStr: string)=>{
const joinedDate = new Date(dateStr);
const now = new Date();


const diffTime = now.getTime() - joinedDate.getTime();
const diffDays = Math.floor(diffTime / (1000*60*60*24))

if(diffDays === 0) return "Today";
if(diffDays === 1) return "1 day ago";
if(diffDays < 7) return `${diffDays} days ago`;
if(diffDays < 14) return "Last Week";

return joinedDate.toLocaleDateString();
}