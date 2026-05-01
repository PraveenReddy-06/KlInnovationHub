import { memo } from 'react';

const Card = ({project}) => {
  return (
    <div className="flex flex-col w-1/3 p-3 bg-blue-500 rounded-3xl">
      <h2 className="font-bold">{project.ProjectName}</h2>
        <div className="flex gap-3">
            <>Profile</>
            <div>
                <p>{project.TeamLead} . {Project.ProjectName}</p>
                <p>{student.technologies}</p>
            </div>
        </div>
      <div className="flex gap-3">
        <h1>Upvotes</h1>
        <h1>Likes</h1>
        <h1>Link</h1>
      </div>

    </div>
  );
};

export default memo(Card);