import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const products = [
  {
    slug: "aura-x1-pro",
    name: "AURA X1 Pro 旗艦手機",
    nameEn: "AURA X1 Pro",
    price: 32900,
    category: "mobile",
    model3d: "phone",
    featured: true,
    colors: ["#22d3ee", "#a78bfa", "#f43f5e", "#e2e8f0"],
    description:
      "6.7 吋 LTPO OLED,1–120Hz ProMotion 自適應更新率。鈦金屬邊框、AI 光影引擎,AURA X1 Pro 重新定義旗艦。",
    specs: [
      { k: "螢幕 Display", v: "6.7\" LTPO OLED / 120Hz" },
      { k: "晶片 Chipset", v: "Neura N3 Pro (3nm)" },
      { k: "相機 Camera", v: "50MP 三鏡頭 / 5x 光學變焦" },
      { k: "電池 Battery", v: "5,400 mAh / 100W 快充" },
      { k: "防護 Rating", v: "IP68" },
    ],
  },
  {
    slug: "pulse-buds",
    name: "PULSE Buds 降噪耳機",
    nameEn: "PULSE Buds",
    price: 5490,
    category: "audio",
    model3d: "earbuds",
    featured: true,
    colors: ["#e2e8f0", "#22d3ee", "#0f172a"],
    description:
      "主動降噪 ANC 3.0,隔絕 98% 環境噪音。11mm 石墨烯動圈,低音下潛更深。PULSE Buds,讓世界只剩音樂。",
    specs: [
      { k: "驅動單體 Driver", v: "11mm 石墨烯動圈" },
      { k: "降噪 ANC", v: "-48dB 自適應降噪" },
      { k: "續航 Battery", v: "8h + 充電盒 32h" },
      { k: "編碼 Codec", v: "LDAC / AAC" },
      { k: "防水 Rating", v: "IPX5" },
    ],
  },
  {
    slug: "orbit-watch-s",
    name: "ORBIT Watch S 智慧手錶",
    nameEn: "ORBIT Watch S",
    price: 9900,
    category: "wearable",
    model3d: "watch",
    featured: false,
    colors: ["#0f172a", "#22d3ee", "#f59e0b"],
    description:
      "1.9 吋 AMOLED 常亮螢幕,雙頻 GPS、ECG 心電圖、血氧偵測。14 天超長續航,ORBIT Watch S 陪你探索每一天。",
    specs: [
      { k: "螢幕 Display", v: "1.9\" AMOLED / 1000nits" },
      { k: "健康 Health", v: "ECG / SpO2 / 心率" },
      { k: "定位 GPS", v: "雙頻 L1+L5" },
      { k: "續航 Battery", v: "14 天" },
      { k: "防水 Rating", v: "5ATM" },
    ],
  },
  {
    slug: "nova-book-14",
    name: "NOVA Book 14 輕薄筆電",
    nameEn: "NOVA Book 14",
    price: 42900,
    category: "computing",
    model3d: "laptop",
    featured: true,
    colors: ["#94a3b8", "#0f172a"],
    description:
      "980g 鎂鋰合金機身,2.8K OLED 觸控螢幕。Neura N3 處理器與 32GB 記憶體,效能與優雅兼得。",
    specs: [
      { k: "螢幕 Display", v: "14\" 2.8K OLED 觸控" },
      { k: "處理器 CPU", v: "Neura N3 / 12 核心" },
      { k: "記憶體 RAM", v: "32GB LPDDR5X" },
      { k: "儲存 Storage", v: "1TB PCIe 4.0 SSD" },
      { k: "重量 Weight", v: "980g" },
    ],
  },
  {
    slug: "vortex-drone-4k",
    name: "VORTEX Drone 4K 空拍機",
    nameEn: "VORTEX Drone 4K",
    price: 18500,
    category: "drone",
    model3d: "drone",
    featured: false,
    colors: ["#0f172a", "#22d3ee"],
    description:
      "三軸機械增穩雲台,4K/60fps HDR 錄影。全向避障、38 分鐘續航,天空是你的取景框。",
    specs: [
      { k: "相機 Camera", v: "4K/60fps HDR / 1\" CMOS" },
      { k: "雲台 Gimbal", v: "三軸機械增穩" },
      { k: "續航 Flight Time", v: "38 分鐘" },
      { k: "圖傳 Range", v: "15km O4 圖傳" },
      { k: "避障 Sensors", v: "全向視覺避障" },
    ],
  },
  {
    slug: "boom-capsule",
    name: "BOOM Capsule 360 音響",
    nameEn: "BOOM Capsule",
    price: 4290,
    category: "audio",
    model3d: "speaker",
    featured: false,
    colors: ["#0f172a", "#22d3ee", "#f43f5e"],
    description:
      "360° 環繞聲場,雙被動輻射器帶來震撼低頻。IPX7 防水、20 小時續航,派對隨身帶著走。",
    specs: [
      { k: "功率 Output", v: "30W / 360° 聲場" },
      { k: "續航 Battery", v: "20 小時" },
      { k: "防水 Rating", v: "IPX7" },
      { k: "連線 Connect", v: "BT 5.3 / AUX" },
      { k: "重量 Weight", v: "680g" },
    ],
  },
  {
    slug: "halo-vr-one",
    name: "HALO VR One 頭戴顯示器",
    nameEn: "HALO VR One",
    price: 16900,
    category: "vr",
    model3d: "vr",
    featured: true,
    colors: ["#e2e8f0", "#0f172a"],
    description:
      "雙 4K Micro-OLED,Pancake 光學鏡組。彩色透視、手部追蹤,虛實之間只剩一線之隔。",
    specs: [
      { k: "顯示 Display", v: "雙 4K Micro-OLED" },
      { k: "光學 Optics", v: "Pancake 鏡組" },
      { k: "追蹤 Tracking", v: "6DoF / 手部追蹤" },
      { k: "透視 Passthrough", v: "4K 彩色透視" },
      { k: "重量 Weight", v: "398g" },
    ],
  },
  {
    slug: "slate-tab-11",
    name: "SLATE Tab 11 平板電腦",
    nameEn: "SLATE Tab 11",
    price: 15900,
    category: "tablet",
    model3d: "tablet",
    featured: false,
    colors: ["#94a3b8", "#a78bfa"],
    description:
      "11 吋 144Hz 高更新率螢幕,附磁吸手寫筆。四揚聲器劇院級音效,工作娛樂一機搞定。",
    specs: [
      { k: "螢幕 Display", v: "11\" LCD / 144Hz" },
      { k: "晶片 Chipset", v: "Neura N2" },
      { k: "音效 Audio", v: "四揚聲器 / Dolby" },
      { k: "配件 Pen", v: "磁吸手寫筆(附贈)" },
      { k: "電池 Battery", v: "8,600 mAh" },
    ],
  },
];

async function main() {
  for (const p of products) {
    const { colors, specs, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...rest,
        colors: JSON.stringify(colors),
        specs: JSON.stringify(specs),
      },
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

// Only run when executed directly (`tsx prisma/seed.ts`), not when imported
// by seed-sql.ts for SQL generation.
if (process.argv[1]?.endsWith("seed.ts")) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
