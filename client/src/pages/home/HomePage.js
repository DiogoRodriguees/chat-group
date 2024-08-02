import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {

    const navigate = useNavigate();

    const colors = [
        '#1890ff',
        '#059212',
        '#7c00fe',
        '#f5004f',
    ];

    const [nickname, setNickname] = useState('');
    const [sessionCode, setSessionCode] = useState('');
    const [color, setColor] = useState('#1890ff');

    const maxSize = 20;

    const isInvalid = !nickname || !sessionCode || nickname.length > maxSize || sessionCode.length > maxSize;

    const handleSubmit = () => {
        if (isInvalid)
            return;

        navigate('/chat', { state: { nickname, sessionCode, color } });
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100vh',
                background: 'radial-gradient(#537895, #09203f)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                className="flex flex-col gap-3"
                style={{
                    borderRadius: 8,
                    background: '#fff',
                    border: 'solid 1px #ededed',
                    padding: 24,
                }}
            >
                <div>
                    <div className="mb-1">
                        Nickname
                    </div>
                    <div>
                        <input
                            className="px-3 py-1 bg-[#0001] rounded-lg"
                            type="text"
                            onChange={e => setNickname(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-1">
                        Código da Sessão
                    </div>
                    <div>
                        <input
                            className="px-3 py-1 bg-[#0001] rounded-lg"
                            type="text"
                            onChange={e => setSessionCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-around mt-3">
                    {colors.map(c => (
                        <button
                            onClick={() => setColor(c)}
                            className="shrink-0 w-5 h-5 rounded-full border-none"
                            style={{
                                backgroundColor: c,
                                transform: color === c ? 'scale(1.3)' : 'scale(1)',
                                transition: 'transform .3s ease',
                            }}
                            >

                        </button>
                    ))}
                </div>

                <button
                    className="rounded-lg border-none"
                    onClick={handleSubmit}
                    style={{
                        padding: 8,
                        width: '100%',
                        color: '#fff',
                        textAlign: 'center',
                        background: '#1890ff',
                        marginTop: 12,
                        cursor: 'pointer',
                    }}
                >
                    Entrar
                </button>
            </div>
        </div>
    );
}