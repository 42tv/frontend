import React from 'react';
import CheckboxButton from "@/app/_components/utils/custom_ui/checkbox";
import { BiTrash } from "react-icons/bi";
import { BlockedUser } from './useBlockedUsers';

interface BlockedUsersTableProps {
    users: BlockedUser[];
    selectedUsers: number[];
    isAllSelected: boolean;
    onSelectUser: (userIdx: number) => void;
    onSelectAll: () => void;
    onRemoveUser: (userIdx: number) => void;
}

const BlockedUsersTable: React.FC<BlockedUsersTableProps> = ({
    users,
    selectedUsers,
    isAllSelected,
    onSelectUser,
    onSelectAll,
    onRemoveUser
}) => {
    const formatDateFromString = (dateString: string) => {
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hour, minute] = timePart.split(":");
      
        return `${year}-${month}-${day} ${hour}:${minute}`;
    };

    return (
        <table className="w-full border-t border-t-2 border-b border-tableBorder dark:border-tableBorder-dark">
            <thead>
                <tr className="border-b border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle">
                    <th className="p-2 w-[50px] text-textBase-dark-bold">
                        <CheckboxButton handleClick={onSelectAll} isChecked={isAllSelected}/>
                    </th>
                    <th className="p-2 w-[200px] text-textBase-dark-bold">닉네임</th>
                    <th className="p-2 w-[140px] text-textBase-dark-bold">차단일</th>
                    <th className="p-2 w-[50px] text-textBase-dark-bold">삭제</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => {
                    return (
                        <tr key={user.id} className="border-b border-tableRowBorder dark:border-tableRowBorder-dark text-center align-middle text-textBase dark:text-textBase-dark overflow-hidden">
                            <td className="p-2 text-textBase-dark-bold">
                                <CheckboxButton 
                                    handleClick={() => onSelectUser(user.blocked.idx)} 
                                    isChecked={selectedUsers.includes(user.blocked.idx)}
                                />
                            </td>
                            <td className="p-2">
                                <span>
                                    {user.blocked.nickname + "(" + user.blocked.user_id + ")"}
                                </span>
                            </td>
                            <td className="p-2">{formatDateFromString(user.created_at)}</td>
                            <td className="p-2 h-[41px] flex justify-center items-center">
                                <BiTrash 
                                    className="text-xl cursor-pointer hover:text-error transition-colors"
                                    onClick={() => onRemoveUser(user.blocked.idx)}
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default BlockedUsersTable;