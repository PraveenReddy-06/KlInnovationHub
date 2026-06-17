import { memo, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import background from '../../Images/Leaderboard.png'
import gold from '../../Images/Gold.png'
import silver from '../../Images/Silver.png'
import bronze from '../../Images/bronze.png'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {

    const [leaderboard, setLeaderboard] = useState([]);
    const medals = [silver, gold, bronze];
    const order =[1,0,2];
    const navigate = useNavigate();

    useEffect(() => {
        const top = async () => {
            try {
                const res = await axios.get("http://localhost:8080/leaderboard");
                console.log(res);
                setLeaderboard(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        top();
    }, []);

  return (
    <div>
        < Navbar/>

        <div className ="flex px-10 gap-5 items-center bg-myLeaderboard text-gray-300 border-t border-t-gray-800">
            <div className ="w-1/2 flex flex-col gap-3 px-25">
                <h1 className =" text-3xl font-bold">Celebrating Our Innovators</h1>
                <p className="font-serif">Impact Recognizing the top students and most impactful projects.</p>
            </div>
            <div className="w-1/2 flex justify-center items-center bg-myLeaderboard">
                <img src={background} className="h-40 w-200" />
            </div>
        </div>

      <div className="p-10">
        <h1 className ="text-xl pb-5 font-bold">Overall Top Innovators</h1>
        <div className="flex gap-20">
            {order.map((pos, index) => {
                const p = leaderboard[pos];
                if (!p) return null;
                return (
                    <div key={index}
                        className="flex flex-col justify-center w-1/3 pt-6 pb-4 px-4 bg-contain bg-no-repeat bg-center min-h-52 text-sm rounded-xl text-center"
                        style={{ backgroundImage: `url(${medals[index]})` }}>

                    {p.type === "SOLO" ? (
                        <>
                            <h2 className="font-semibold text-xl">{p.studentName}</h2>
                            <h2>{p.studentId}</h2>
                            <h2>from {p.branch}</h2>
                        </>
                    ):(
                        <>
                            <h2 className="font-semibold text-lg">{p.teamLead}</h2>
                            <h3 className="text-sm">{p.teamSize > 1? `Team of ${p.teamSize}`: "Team Lead"}</h3>
                        </>
                    )}
                        <span className="font-medium">⭐ {p.likeCount} Likes</span>
                        <h3 className="mt-1">{p.projectName}</h3>
                    </div>
                );
            })}
        </div>
      </div>

<div className="px-15 pb-10">
    <h2 className="text-2xl font-bold mb-6">
        Leading Projects
    </h2>
    <div className="overflow-hidden shadow-xl border border-slate-200 bg-linear-to-br from-slate-50 via-white to-indigo-50">
    <div className="overflow-hidden  shadow-lg border border-gray-200">
        <table className="w-full">
            <thead className="sticky top-0 z-10">
                <tr className="bg-secondary text-white">
                    <th className="px-6 py-4 text-left">Rank</th>
                    <th className="px-6 py-4 text-left">Project</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Members</th>
                    <th className="px-6 py-4 text-center">Likes</th>
                    <th className="px-6 py-4 text-center">GitHub</th>
                    <th className="px-6 py-4 text-center">Live Demo</th>
                </tr>
            </thead>

            <tbody>
                {leaderboard.map((p, index) => (
                    <tr key={index}   onClick={() => navigate(`/profile/${p.type === "SOLO" ? p.studentId: p.teamLeadId}`)}
                        className={` border-b transition-all duration-200 cursor-pointer hover:bg-vanilla-custard rounded-lg p-2
                            ${
                                index === 0 ? "bg-yellow-100 border-l-4 border-yellow-500"
                                : index === 1? "bg-slate-100 border-l-4 border-slate-500"
                                : index === 2? "bg-orange-100 border-l-4 border-orange-500"
                                : "hover:bg-tan"}`}>

                        <td className="px-6 py-4 font-bold">
                            {index === 0 ? (<span>🏆 #1</span>
                            ) : index === 1 ? ( <span>🥈 #2</span>
                            ) : index === 2 ? (<span>🥉 #3</span>
                            ) : (<span>#{index + 1}</span>
                            )}
                        </td>

                        <td className={`px-6 py-4 ${index < 3? "font-bold text-lg": "font-medium"}`}>
                            {p.projectName}
                        </td>

                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-semibold ${p.type === "SOLO"? "bg-green-100 text-green-700": "bg-purple-100 text-purple-700"}`}>
                                {p.type}
                            </span>
                        </td>

                        <td className="px-6 py-4 max-w-md">
                            {p.type === "SOLO"
                                ? p.studentName
                                : (p.members?.length? p.members.map(member =>member === p.teamLead? `${member} (Lead)`: member ).join(", "): `${p.teamLead} (Lead)`)}
                        </td>

                        <td className="px-6 py-4 text-center font-bold">
                            ⭐ {p.likeCount}
                        </td>

                        <td className="px-6 py-4 text-center">
                            {p.githubUrl ? (
                                <a href={p.githubUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="bg-gray-300 text-black px-3 py-2 ">
                                    GitHub
                                </a>
                            ) : (
                                <span className="text-gray-400">N/A</span>
                            )}
                        </td>

                        <td className="px-6 py-4 text-center">
                            {p.liveUrl ? (
                                <a href={p.liveUrl} onClick={(e) => e.stopPropagation()} target="_blank"rel="noreferrer"className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700 transition">
                                    Open
                                </a>
                            ) : (
                                <span className="text-gray-400">N/A</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div></div>
</div>

    </div>
  );
};

export default memo(Leaderboard);