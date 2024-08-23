import { useOthers, useSelf } from "@liveblocks/react";
import  Avatar  from "./Avatar";
import styles from "./Avatar.module.css";
import { useMemo } from "react";

const ActiveUsers = () => {

  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  const memoizedUsers = useMemo(()=>(
    <div className="flex items-center justify-center gap-1 py-2">
    <div className="flex pl-3">
      {currentUser && (
          <Avatar name="You" otherStyles="border-[3px] border-primary-green" />
      )}
      {users.slice(0, 3).map(({ connectionId, info }) => {
        return (
          //   <Avatar key={connectionId} src={info.avatar} name={info.name} />
          // <div className="border-2 border-green500">A 
          <Avatar key={connectionId} name="other" otherStyles="-ml-3" />
          // </div>
        );
      })}
      {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
    </div>

  </div>
  ),[users.length])

  return  memoizedUsers;

}
export default ActiveUsers;
