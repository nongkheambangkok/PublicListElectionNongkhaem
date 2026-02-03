export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // รับค่า hash_id ที่ส่งมาจากหน้าเว็บ
    const searchHash = url.searchParams.get("hash_id");
  
    // ถ้าไม่มีการส่งค่ามา ให้แจ้ง Error
    if (!searchHash) {
      return new Response(JSON.stringify({ error: "No ID provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    try {
      // เรียกใช้ D1 Database
      // *** สำคัญ: ใน Dashboard คุณต้อง Bind D1 ให้ตัวแปรชื่อ "DB" ***
      const stmt = env.DB.prepare("SELECT * FROM encrypted_voters WHERE hash_id = ?").bind(searchHash);
      const data = await stmt.first();
  
      // ถ้าไม่เจอข้อมูล ส่งค่า null กลับไป
      if (!data) {
        return new Response(JSON.stringify(null), {
            headers: { "Content-Type": "application/json" },
        });
      }

      // ส่งข้อมูลกลับไปให้ Frontend (ยังเป็นข้อมูลที่ชื่อถูกเข้ารหัสอยู่)
      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
  
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }