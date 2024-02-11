import { FC } from "react";

interface FollowersCounterProps {
  followers: number;
  following: number;
}

const FollowersCounter: FC<FollowersCounterProps> = ({
  followers,
  following,
}) => {
  return (
    <div className="mt-3 flex gap-4">
      <p className="text-sm text-muted-foreground">Followers: {followers}</p>
      <p className="text-sm text-muted-foreground">Following: {following}</p>
    </div>
  );
};

export default FollowersCounter;
