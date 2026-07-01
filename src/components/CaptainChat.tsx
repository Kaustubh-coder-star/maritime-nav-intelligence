import { useState, useRef, useEffect } from 'react';

type Props = {
  waveHeight: number | null;
  totalHours: number;
  totalFuel: number;
};

type Message = { role: 'user' | 'captain'; text: string; id: number };


    try {
      // Send message straight to your local n8n via ngrok tunnel
      const response = await fetch('https://botanical-durably-coyness.ngrok-free.dev/webhook-test/maritime-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true', // Bypasses the warning screen
        },
        body: JSON.stringify({
          text: q,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Webhook failed');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: 'captain', text: data.reply || 'Message processed.', id: msgId.current++ },
      ]);
    } catch (error) {
      console.error(error);
      // Fallback to local mock response if backend is offline
     // const reply = getReply(q, waveHeight, totalHours, totalFuel);
    //  setMessages((prev) => [
    //    ...prev,
    //    { role: 'captain', text: reply, id: msgId.current++ },
    //  ]);
    } finally {
      setTyping(false);
    }
  };
;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '4px 2px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0,180,255,0.2) transparent',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              gap: '8px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                flexShrink: 0,
                background:
                  msg.role === 'captain'
                    ? 'radial-gradient(circle, rgba(0,180,255,0.3), rgba(0,80,160,0.4))'
                    : 'radial-gradient(circle, rgba(0,255,136,0.2), rgba(0,100,60,0.3))',
                border: `1px solid ${
                  msg.role === 'captain'
                    ? 'rgba(0,180,255,0.5)'
                    : 'rgba(0,255,136,0.4)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontFamily: 'Orbitron',
                color: msg.role === 'captain' ? '#00b4ff' : '#00ff88',
              }}
            >
              {msg.role === 'captain' ? 'AI' : 'YOU'}
            </div>
            <div
              style={{
                maxWidth: '82%',
                padding: '9px 12px',
                background:
                  msg.role === 'captain'
                    ? 'rgba(0,40,80,0.7)'
                    : 'rgba(0,60,40,0.5)',
                border: `1px solid ${
                  msg.role === 'captain'
                    ? 'rgba(0,180,255,0.2)'
                    : 'rgba(0,255,136,0.15)'
                }`,
                borderRadius:
                  msg.role === 'captain'
                    ? '2px 8px 8px 8px'
                    : '8px 2px 8px 8px',
                fontFamily: 'Rajdhani',
                fontSize: '14px',
                lineHeight: 1.55,
                color: '#d0eeff',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div
            style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(0,180,255,0.3), rgba(0,80,160,0.4))',
                border: '1px solid rgba(0,180,255,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontFamily: 'Orbitron',
                color: '#00b4ff',
                flexShrink: 0,
              }}
            >
              AI
            </div>
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(0,40,80,0.7)',
                border: '1px solid rgba(0,180,255,0.2)',
                borderRadius: '2px 8px 8px 8px',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#00b4ff',
                    animation: `ariadot 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '5px',
          margin: '8px 0 6px',
        }}
      >
        {SUGGESTIONS.slice(0, 4).map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            style={{
              background: 'rgba(0,180,255,0.07)',
              border: '1px solid rgba(0,180,255,0.2)',
              color: '#5aaccc',
              fontFamily: 'Rajdhani',
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: '2px',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about fuel, weather, route, piracy..."
          style={{
            flex: 1,
            background: 'rgba(0,180,255,0.07)',
            border: '1px solid rgba(0,180,255,0.25)',
            borderRadius: '3px',
            color: '#e0f4ff',
            fontFamily: 'Rajdhani',
            fontSize: '14px',
            padding: '9px 12px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => send(input)}
          disabled={typing || !input.trim()}
          style={{
            background: typing ? 'rgba(0,40,80,0.4)' : 'rgba(0,180,255,0.2)',
            border: '1px solid rgba(0,180,255,0.5)',
            color: typing ? '#3a6080' : '#00b4ff',
            fontFamily: 'Orbitron',
            fontSize: '11px',
            padding: '9px 14px',
            cursor: typing ? 'not-allowed' : 'pointer',
            borderRadius: '3px',
            letterSpacing: '0.05em',
          }}
        >
          SEND
        </button>
      </div>

      <style>{`
        @keyframes ariadot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
