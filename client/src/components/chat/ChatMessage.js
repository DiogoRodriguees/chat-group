export default function ChatMessage({
    message = '',
    isTyping = false,
    isAuthor = false,
    authorName = '',
    color = '#1890ff'
}) {
    return (
        <div
            className={`flex gap-3 ${isAuthor ? 'flex-row-reverse' : ''}`}
            style={{
                paddingLeft: isAuthor ? 56 : 0,
                paddingRight: !isAuthor ? 56 : 0,
            }}
        >
            <div
                className="uppercase text-2xl font-semibold w-12 h-12 flex justify-center items-center text-white rounded-full shrink-0"
                style={{ backgroundColor: color }}
            >
                {authorName[0]}
            </div>
            <div>
                <div className={`flex gap-2 ${isAuthor ? 'flex-row-reverse' : ''}`}>
                    <b>{authorName}</b>
                    {isTyping && <div className='text-[#0007]'>Digitando</div>}
                </div>
                <div
                    className="mt-2 px-4 py-2 rounded-xl rounded-tl-none shadow-[0_0_4px_#0001]"
                    style={{
                        backgroundColor: isAuthor ? '#1890ff' : '#fff',
                        color: isAuthor ? '#fff' : '#131313',
                        borderTopLeftRadius: isAuthor ? 12 : 0,
                        borderTopRightRadius: !isAuthor ? 12 : 0,
                    }}
                >
                    <div>{message}</div>
                </div>
            </div>
        </div>
    );
}