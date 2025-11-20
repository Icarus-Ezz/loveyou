import React, { useEffect, useState } from 'react';

// Birthday Website - Single-file React component
// TailwindCSS classes are used for styling (assumes Tailwind is available in the host app)

export default function BirthdaySite() {
  // Default event date: December 20, 2025 18:00 local
  const defaultDate = new Date('2025-12-20T18:00:00');
  const [eventDate, setEventDate] = useState(defaultDate.toISOString().slice(0,16));
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('birthday_guests') || '[]');
    } catch { return []; }
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    localStorage.setItem('birthday_guests', JSON.stringify(guests));
  }, [guests]);

  function getCountdownParts() {
    const target = new Date(eventDate);
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  }

  function handleRSVP(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const newGuest = { id: Date.now(), name: name.trim(), message: message.trim(), date: new Date().toISOString() };
    setGuests([newGuest, ...guests]);
    setName('');
    setMessage('');
  }

  function clearGuests() {
    if (!confirm('Xóa tất cả RSVPs?')) return;
    setGuests([]);
  }

  function downloadInvite() {
    // open a printable invitation in a new window
    const html = `
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invitation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; margin:40px; }
          .card { border: 6px dashed #eab308; padding:30px; border-radius:16px; max-width:720px; margin:0 auto; text-align:center }
          h1{ margin:0 0 8px 0 }
          p{ margin:6px 0 }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>You're invited!</h1>
          <p><strong>Event:</strong> Birthday Celebration</p>
          <p><strong>When:</strong> ${new Date(eventDate).toLocaleString()}</p>
          <p><strong>Where:</strong> [Add address or link]</p>
          <p>Bring your smile — RSVP via the event page.</p>
        </div>
      </body>
      </html>
    `;
    const w = window.open('', '_blank');
    if (!w) return alert('Không mở được cửa sổ mới — hãy cho phép popup.');
    w.document.write(html);
    w.document.close();
  }

  function removeGuest(id) {
    setGuests(guests.filter(g => g.id !== id));
  }

  const countdown = getCountdownParts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Tiệc Sinh Nhật</h1>
            <p className="text-sm text-gray-600">Tạo trang sự kiện, RSVP, đếm ngược, và gallery - chỉnh sửa mọi thứ nhanh chóng.</p>
          </div>
          <div className="text-right">
            <button onClick={downloadInvite} className="px-4 py-2 bg-yellow-400 rounded-lg font-semibold shadow">Tải thiệp / In</button>
          </div>
        </header>

        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Hero + Countdown + Details */}
          <section className="lg:col-span-2 p-4 rounded-lg">
            <div className="rounded-xl p-6 bg-gradient-to-r from-pink-100 via-white to-yellow-50 shadow-inner">
              <h2 className="text-2xl font-bold">Chuẩn bị cho ngày vui!</h2>
              <p className="text-sm text-gray-700 mt-1">Sự kiện chính: <strong>Tiệc Sinh Nhật</strong></p>

              <div className="mt-6 grid grid-cols-4 gap-3 text-center">
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold">{String(countdown.days).padStart(2,'0')}</div>
                  <div className="text-xs text-gray-500">Ngày</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold">{String(countdown.hours).padStart(2,'0')}</div>
                  <div className="text-xs text-gray-500">Giờ</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold">{String(countdown.minutes).padStart(2,'0')}</div>
                  <div className="text-xs text-gray-500">Phút</div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold">{String(countdown.seconds).padStart(2,'0')}</div>
                  <div className="text-xs text-gray-500">Giây</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="flex-1">
                  <div className="text-xs text-gray-600">Chọn ngày & giờ sự kiện</div>
                  <input type="datetime-local" value={eventDate} onChange={(e)=>setEventDate(e.target.value)} className="mt-1 w-full p-2 rounded-md border" />
                </label>
                <div className="w-full sm:w-auto">
                  <a className="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium" href={`https://calendar.google.com/calendar/r/eventedit?text=Birthday+Party&dates=${new Date(eventDate).toISOString().replace(/-|:|\.\d+/g,'')}/${new Date(eventDate).toISOString().replace(/-|:|\.\d+/g,'')}&details=Sinh+nhạt`} target="_blank" rel="noreferrer">Thêm vào Google Calendar</a>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">Địa điểm</h3>
                <p className="text-sm text-gray-600">[Thêm địa điểm hoặc đường link cuộc họp trực tuyến]</p>
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Gallery</h3>
              <p className="text-sm text-gray-500">Kéo và thả (hoặc chỉnh sửa source) để đổi ảnh — demo sử dụng placeholder.</p>

              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['https://picsum.photos/400/300?random=1','https://picsum.photos/400/300?random=2','https://picsum.photos/400/300?random=3','https://picsum.photos/400/300?random=4'].map((src,i)=> (
                  <div key={i} className="rounded-lg overflow-hidden shadow">
                    <img src={src} alt={`photo-${i}`} className="w-full h-32 object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Playlist */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Playlist</h3>
              <p className="text-sm text-gray-500">Chèn playlist Spotify/YouTube để phát nhạc tại buổi tiệc.</p>
              <div className="mt-3">
                <iframe title="playlist" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" style={{width:'100%', height:80, borderRadius:12}} frameBorder="0" allowTransparency="true" allow="encrypted-media"></iframe>
              </div>
            </div>
          </section>

          {/* Right column: RSVP form + Guest list */}
          <aside className="p-4 rounded-lg bg-white/60 shadow">
            <h3 className="text-xl font-semibold">RSVP — Xác nhận tham gia</h3>
            <form onSubmit={handleRSVP} className="mt-3 space-y-3">
              <div>
                <label className="text-sm">Tên</label>
                <input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 rounded border mt-1" placeholder="Ví dụ: Minh" />
              </div>
              <div>
                <label className="text-sm">Lời nhắn (tùy chọn)</label>
                <input value={message} onChange={e=>setMessage(e.target.value)} className="w-full p-2 rounded border mt-1" placeholder="Chúc mừng!" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-3 py-2 bg-green-500 text-white rounded">Gửi RSVP</button>
                <button type="button" onClick={()=>{ setName(''); setMessage(''); }} className="px-3 py-2 border rounded">Hủy</button>
              </div>
            </form>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Danh sách khách ({guests.length})</h4>
                <button onClick={clearGuests} className="text-sm text-red-600">Xóa tất cả</button>
              </div>

              <div className="mt-3 space-y-2 max-h-64 overflow-auto">
                {guests.length === 0 && <div className="text-sm text-gray-500">Chưa có khách nào RSVP.</div>}
                {guests.map(g => (
                  <div key={g.id} className="p-2 bg-white rounded flex items-start justify-between shadow-sm">
                    <div>
                      <div className="font-medium">{g.name}</div>
                      <div className="text-xs text-gray-500">{g.message}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">{new Date(g.date).toLocaleString()}</div>
                      <button onClick={()=>removeGuest(g.id)} className="mt-1 text-xs text-red-500">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>Nếu muốn gửi RSVP qua email, bấm vào nút bên dưới.</p>
              <a className="inline-block mt-2 px-3 py-2 bg-blue-600 text-white rounded" href={`mailto:?subject=RSVP%20for%20Birthday&body=I%20will%20attend%20the%20birthday%20on%20${encodeURIComponent(new Date(eventDate).toLocaleString())}`}>RSVP bằng Email</a>
            </div>
          </aside>
        </main>

        <footer className="mt-6 text-center text-xs text-gray-500">
          <p>Trang demo — chỉnh sửa nội dung, ảnh và link theo ý bạn. Để deploy: GitHub Pages / Vercel / Netlify.</p>
        </footer>
      </div>
    </div>
  );
}
