import { useEffect, useState } from "react";
import axiosInstance from "../../Api/axiosInstance"

const FollowSection = ({ studentId, isOwnProfile }) => {

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchData = async () => {
    try {

      const followersRes = await axiosInstance.get(
        `/followers/count/${studentId}`
      );

      const followingRes = await axiosInstance.get(
        `/followers/followingCount/${studentId}`
      );

      setFollowersCount(followersRes.data);
      setFollowingCount(followingRes.data);

      if (!isOwnProfile) {

        const followRes = await axiosInstance.get(
          `/followers/isFollowing/${studentId}`
        );

        setIsFollowing(followRes.data);
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const handleFollow = async () => {

    try {

      if (isFollowing) {

        await axiosInstance.delete(
          `/followers/unfollow/${studentId}`
        );

        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);

      } else {

        await axiosInstance.post(
          `/followers/follow/${studentId}`
        );

        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
      }

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-4">

      <div className="flex items-center gap-8">

        <div className="text-white">
          <span className="font-bold text-lg">
            {followersCount}
          </span>
          <span className="ml-2">
            Followers
          </span>
        </div>

        <div className="text-white">
          <span className="font-bold text-lg">
            {followingCount}
          </span>
          <span className="ml-2">
            Following
          </span>
        </div>

        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={
              isFollowing
                ? "bg-red-500 text-white px-5 py-2 rounded-xl"
                : "bg-cyan-500 text-white px-5 py-2 rounded-xl"
            }
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}

      </div>

    </div>
  );
};

export default FollowSection;