import { memo, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import background from '../../Images/LeaderboardBg.png'
import gold from '../../Images/Gold.png'
import silver from '../../Images/Silver.png'
import bronze from '../../Images/bronze.png'
import axios from 'axios';

const Leaderboard = () => {

    const [project, setProject] = useState([]);
    const medals = [silver, gold, bronze];
    const order =[1,0,2];

    useEffect(() => {
        const top = async () => {
            try {
                const res = await axios.get("http://localhost:8080/likes/top3");
                setProject(res.data);
                console.log("triggered");
            } catch (err) {
                console.error(err);
            }
        };
        top();
    }, []);

  return (
    <div>
        < Navbar/>

        <div className ="flex px-10 gap-5 items-center bg-blue-100 text-black">
            <div className ="w-1/2 flex flex-col gap-3">
            <h1 className =" text-3xl font-bold">Celebrating Our Innovators</h1>
            <p className="font-serif">Impact Recognizing the top students and most impactful projects.</p>
            </div>
            <div className="w-1/2 flex justify-center items-center">
            <img src={background} className="h-40 w-200" alt=""/>
            </div>
        </div>

      <div className="p-10">
        <h1 className ="text-xl pb-5 font-bold">Overall Top Innovators</h1>
        <div className="flex gap-20">
            {order.map((pos, index) => {
                const p = project[pos];
                if (!p) return null;
                return (
                    <div key={index}
                        className="flex flex-col justify-center w-1/3 pt-6 pb-4 px-4 bg-contain bg-no-repeat bg-center h-52 rounded-xl text-center"
                        style={{ backgroundImage: `url(${medals[index]})` }}>

                        <div className="flex gap-3 pl-30 mb-5">
                            <div className=" flex items-center justify-center">
                                {p.studentName?.[0] || "P"}
                            </div>
                            <div className="flex flex-col items-start">
                                <h2 className="font-semibold text-xl">{p.student.student_name}</h2>
                                <h2 className="text-md">{p.student.studentId}</h2>
                                <h2 className="text-md">from {p.student.branch}</h2>
                            </div>
                        </div>
                        <span className="font-medium">⭐ {p.likeCount} Likes</span>
                        <h3 className="mt-1">{p.projectName}</h3>

                    </div>
                );
            })}
        </div>
      </div>

    </div>
  );
};

export default memo(Leaderboard);