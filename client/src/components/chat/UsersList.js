export default function UsersList({
    users
}) {
    console.log(users);

    return (
        <div className='min-w-80 h-[90%] bg-[#f6f7f8] rounded-lg p-6 border border-[#dedede] shadow-[0_0_15px_#d4d4d4] flex flex-col'>

            <div className="text-2xl mb-6">Usuários</div>
            {users.map((u, index) => (
                <div className="flex items-center gap-3 py-4 border-b"
                    style={{
                        borderColor: index < users.length - 1 ? '#dedede' : 'transparent'
                    }}
                    >
                    {console.log(u.userId, u.color)}
                    <div
                        className="uppercase text-2xl font-semibold w-12 h-12 flex justify-center items-center text-white rounded-full shrink-0"
                        style={{ backgroundColor: `#${u.color}` }}
                    >
                        {u.userId[0]}
                    </div>
                    <div>
                        {u.userId}
                    </div>
                </div>
            ))}
        </div>
    );
}