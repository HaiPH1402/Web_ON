// Nội dung tĩnh: công trình tiêu biểu, cảm nhận KH, đối tác

export type Project = {
  title: string;
  location: string;
  scope: string;
  year: string;
  image: string;
  tag: string;
};

export const PROJECTS: Project[] = [
  {
    title: "Chung cư cao tầng Sunrise City",
    location: "Quận 7, TP.HCM",
    scope: "Cấp thoát nước toàn khu 3 block, 1.200 căn hộ",
    year: "2024",
    image: "/projects/duan1.jpg",
    tag: "Chung cư",
  },
  {
    title: "Khu biệt thự Lakeview Villa",
    location: "Thủ Đức, TP.HCM",
    scope: "Hệ thống ống HDPE & PPR cho 45 căn biệt thự",
    year: "2024",
    image: "/projects/duan4.jpg",
    tag: "Biệt thự",
  },
  {
    title: "Resort & Spa Ocean Pearl",
    location: "Phú Quốc, Kiên Giang",
    scope: "Cấp nước hồ bơi, spa và 120 phòng nghỉ",
    year: "2023",
    image: "/projects/duan6.jpg",
    tag: "Nghỉ dưỡng",
  },
  {
    title: "Tòa văn phòng Metro Tower",
    location: "Quận 1, TP.HCM",
    scope: "Ống thép mạ kẽm & van công nghiệp 28 tầng",
    year: "2023",
    image: "/projects/duan3.jpg",
    tag: "Văn phòng",
  },
  {
    title: "Nhà máy nước sạch Đồng Nai",
    location: "Biên Hòa, Đồng Nai",
    scope: "Đường ống HDPE DN400 truyền tải 8km",
    year: "2022",
    image: "/projects/duan5.jpg",
    tag: "Hạ tầng",
  },
];

export type Testimonial = {
  name: string;
  role: string;
  content: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Anh Trần Minh Hoàng",
    role: "Nhà thầu cơ điện M&E",
    content:
      "Giá sỉ tốt, hàng luôn có sẵn số lượng lớn và giao đúng tiến độ công trình. Đội ngũ tư vấn nắm rõ thông số kỹ thuật.",
  },
  {
    name: "Chị Nguyễn Thu Hà",
    role: "Chủ cửa hàng vật tư",
    content:
      "Đặt hàng online nhanh, báo giá rõ ràng theo từng bậc số lượng. Công nợ linh hoạt nên rất tiện nhập sỉ.",
  },
  {
    name: "Anh Lê Quốc Bảo",
    role: "Kỹ sư xây dựng",
    content:
      "Sản phẩm chính hãng đầy đủ CO/CQ, đúng tiêu chuẩn TCVN. Yên tâm dùng cho các dự án lớn.",
  },
];

export const BRANDS = ["Bình Minh", "Tiền Phong", "Hoa Sen", "Dekko", "Đệ Nhất", "SCG", "Vesbo", "Sino"];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  // Nội dung dạng đoạn văn (mỗi phần tử là 1 đoạn hoặc tiêu đề bắt đầu bằng "## ")
  body: string[];
};

export const NEWS: Article[] = [
  {
    slug: "cach-chon-ong-nuoc-phu-hop",
    title: "Cách chọn ống nước phù hợp cho từng công trình",
    excerpt:
      "uPVC, HDPE hay PPR? Mỗi loại ống có ưu nhược điểm và phạm vi sử dụng riêng. Bài viết giúp bạn chọn đúng loại ống cho công trình.",
    image: "/news/tin1.jpg",
    category: "Hướng dẫn",
    date: "2026-05-20",
    author: "Phòng kỹ thuật",
    body: [
      "Việc chọn đúng loại ống nước ảnh hưởng trực tiếp đến độ bền, an toàn và chi phí của cả công trình. Dưới đây là hướng dẫn nhanh theo từng loại vật liệu phổ biến.",
      "## Ống uPVC",
      "Ống uPVC giá thành hợp lý, nhẹ, dễ thi công, chịu được áp lực trung bình. Phù hợp cho hệ cấp nước lạnh và thoát nước dân dụng. Không nên dùng cho nước nóng vì chịu nhiệt kém.",
      "## Ống HDPE",
      "Ống HDPE dẻo, chịu áp lực cao, kháng hóa chất tốt, tuổi thọ có thể đến 50 năm. Thường dùng cho đường ống truyền tải, cấp nước ngoài trời, luồn cáp và hạ tầng.",
      "## Ống PPR",
      "Ống PPR chịu nhiệt tốt (lên đến 95°C), là lựa chọn số một cho hệ nước nóng – lạnh trong nhà. Mối nối hàn nhiệt kín, an toàn vệ sinh.",
      "Nếu cần tư vấn cụ thể theo bản vẽ, hãy gửi yêu cầu báo giá — đội ngũ kỹ thuật sẽ hỗ trợ chọn vật tư tối ưu.",
    ],
  },
  {
    slug: "kinh-nghiem-thi-cong-duong-ong-cap-nuoc",
    title: "Kinh nghiệm thi công đường ống cấp nước cho công trình lớn",
    excerpt:
      "Những lưu ý quan trọng khi thi công hệ thống cấp nước quy mô lớn: từ tính toán áp lực, chọn van đến nghiệm thu.",
    image: "/news/tin3.jpg",
    category: "Kỹ thuật",
    date: "2026-05-08",
    author: "KS. Lê Quốc Bảo",
    body: [
      "Thi công đường ống cấp nước cho công trình lớn đòi hỏi sự chuẩn bị kỹ lưỡng để đảm bảo tiến độ và chất lượng.",
      "## Tính toán áp lực và lưu lượng",
      "Cần xác định đúng đường kính ống theo lưu lượng và áp lực thiết kế, tránh hiện tượng tụt áp ở các tầng cao hoặc cuối tuyến.",
      "## Lựa chọn van và phụ kiện",
      "Van khóa, van một chiều và đồng hồ nước cần đặt ở vị trí thuận tiện vận hành, bảo trì. Ưu tiên phụ kiện cùng hệ vật liệu với ống chính.",
      "## Nghiệm thu và thử áp",
      "Trước khi đưa vào sử dụng, hệ thống phải được thử áp lực theo tiêu chuẩn để phát hiện rò rỉ. Lưu hồ sơ CO/CQ của vật tư để phục vụ nghiệm thu.",
    ],
  },
  {
    slug: "xu-huong-vat-tu-nganh-nuoc-2026",
    title: "Xu hướng vật tư ngành nước năm 2026",
    excerpt:
      "Vật liệu thân thiện môi trường, ống thông minh và giải pháp tiết kiệm nước đang định hình thị trường vật tư ngành nước.",
    image: "/news/tin2.jpg",
    category: "Thị trường",
    date: "2026-04-15",
    author: "Ban biên tập",
    body: [
      "Năm 2026 chứng kiến nhiều thay đổi trong ngành vật tư nước, hướng tới bền vững và hiệu quả.",
      "## Vật liệu bền vững",
      "Ống HDPE tái chế và các dòng nhựa thân thiện môi trường ngày càng được ưa chuộng nhờ tuổi thọ cao và khả năng tái sử dụng.",
      "## Giải pháp tiết kiệm nước",
      "Các thiết bị van và đồng hồ nước thông minh giúp giám sát và giảm thất thoát, đặc biệt hữu ích cho khu đô thị và nhà máy.",
      "Doanh nghiệp cập nhật xu hướng sớm sẽ có lợi thế cạnh tranh về chi phí và uy tín.",
    ],
  },
  {
    slug: "huong-dan-lap-dat-ong-ppr-dung-ky-thuat",
    title: "Hướng dẫn lắp đặt ống PPR đúng kỹ thuật",
    excerpt:
      "Quy trình hàn nhiệt ống PPR chuẩn giúp mối nối kín, bền và an toàn cho hệ nước nóng – lạnh.",
    image: "/news/tin4.jpg",
    category: "Hướng dẫn",
    date: "2026-03-30",
    author: "Phòng kỹ thuật",
    body: [
      "Ống PPR được nối bằng phương pháp hàn nhiệt. Thực hiện đúng quy trình sẽ cho mối nối kín tuyệt đối.",
      "## Chuẩn bị",
      "Cắt ống vuông góc, làm sạch đầu ống và phụ kiện. Chọn đầu gia nhiệt đúng kích thước đường kính.",
      "## Gia nhiệt và ghép nối",
      "Gia nhiệt đồng thời đầu ống và phụ kiện theo thời gian khuyến nghị, sau đó ghép thẳng (không xoay) và giữ cố định vài giây để mối hàn ổn định.",
      "## Lưu ý an toàn",
      "Để mối nối nguội tự nhiên trước khi thử áp. Không thi công khi nhiệt độ môi trường quá thấp.",
    ],
  },
];
