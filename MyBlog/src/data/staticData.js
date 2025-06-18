import { ref, watch } from 'vue';

const STORAGE_KEY_POSTS = 'myblog_posts';
const STORAGE_KEY_VIDEOS = 'myblog_videos';
const STORAGE_KEY_USERS = 'myblog_users'; // Key for authentication users
const STORAGE_KEY_BANNERS = 'myblog_banners'; // Key for banners
const STORAGE_KEY_SHARED_POSTS = 'myblog_shared_posts'; // New key for shared posts

// Hàm trợ giúp để tạo URL động cho tài sản trong thư mục src/assets
// Điều này đảm bảo rằng Vite xử lý đúng các đường dẫn tệp trong quá trình phát triển và xây dựng
const getAssetUrl = (path) => {
  return new URL(`../assets/images/${path}`, import.meta.url).href;
};

// Đường dẫn avatar mặc định chung khi không có ảnh
export const GENERIC_DEFAULT_AVATAR = 'https://placehold.co/150x150/D3D3D3/FFFFFF?text=Avatar';

// Dữ liệu người dùng mặc định (tĩnh) - Mỗi user giờ có thêm profileData
const defaultUsers = [
  {
    name: 'Lê Anh Tuấn',
    email: 'leanhtuan@example.com', // Cập nhật email cho rõ ràng
    password: 'admin123',
    profilePic: getAssetUrl('at.jpg'),
    profileData: {
      dob: '1990-01-01',
      gender: 'male',
      phone: '0987654321',
      address: '123 Đường Chính, Hà Nội',
      bio: 'Người quản trị hệ thống với kinh nghiệm nhiều năm trong phát triển web.',
    }
  },
  {
    name: 'Nguyễn Gia Bảo',
    email: 'nguyengiabao@example.com',
    password: 'bao123',
    profilePic: getAssetUrl('ngb.jpg'),
    profileData: {
      dob: '1995-05-10',
      gender: 'male',
      phone: '0123456789',
      address: '456 Phố Phụ, Hồ Chí Minh',
      bio: 'Yêu thích du lịch và khám phá những điều mới mẻ.',
    }
  },
  {
    name: 'Trình Trung Hiếu',
    email: 'trinhtrunghieu@example.com',
    password: 'hieu123',
    profilePic: getAssetUrl('tth.jpg'),
    profileData: {
      dob: '1988-11-22',
      gender: 'male',
      phone: '0901234567',
      address: '789 Đường Hoa, Đà Nẵng',
      bio: 'Đam mê viết lách và chia sẻ kiến thức về công nghệ.',
    }
  },
  {
    name: 'Võ Trần An Sang',
    email: 'votranansang@example.com',
    password: 'sang123',
    profilePic: getAssetUrl('vtas.jpg'),
    profileData: {
      dob: '2000-03-08',
      gender: 'male',
      phone: '0912345678',
      address: '321 Phố Cây, Huế',
      bio: 'Nhiếp ảnh gia nghiệp dư, yêu thích chụp ảnh phong cảnh.',
    }
  },
  {
    name: 'Phạm Thị Mai',
    email: 'phamthimai@example.com',
    password: 'mai123',
    profilePic: 'https://placehold.co/150x150/E91E63/FFFFFF?text=Mai',
    profileData: {
      dob: '1992-07-17',
      gender: 'female',
      phone: '0978901234',
      address: '654 Đường Biển, Nha Trang',
      bio: 'Yêu thích ẩm thực và khám phá văn hóa địa phương.',
    }
  },
  {
    name: 'Đặng Văn Long',
    email: 'dangvanlong@example.com',
    password: 'long123',
    profilePic: GENERIC_DEFAULT_AVATAR,
    profileData: {
      dob: '1998-09-03',
      gender: 'male',
      phone: '0965432109',
      address: '987 Đường Rừng, Đà Lạt',
      bio: 'Thích khám phá thiên nhiên và các hoạt động ngoài trời.',
    }
  }
];

// Hàm để lấy tác giả ngẫu nhiên từ danh sách defaultUsers
const getRandomAuthor = () => {
  const authors = defaultUsers.map(user => user.name);
  return authors[Math.floor(Math.random() * authors.length)];
};

// Dữ liệu giả mặc định (sẽ được sử dụng nếu không có dữ liệu trong localStorage)
const defaultPosts = [
  // Các bài viết về IT, lập trình, AI được đưa lên đầu
  {
    id: 'it-post-1',
    title: 'Machine Learning trong Phân tích Dữ liệu Lớn',
    fullContent: 'Machine Learning (ML) đã trở thành một công cụ không thể thiếu trong lĩnh vực phân tích dữ liệu lớn. Bài viết này khám phá cách các thuật toán ML được sử dụng để trích xuất thông tin chi tiết, dự đoán xu hướng và tự động hóa các quy trình từ các tập dữ liệu khổng lồ. Chúng ta sẽ đi sâu vào các mô hình phổ biến như học có giám sát, học không giám sát và học tăng cường, đồng thời thảo luận về các ứng dụng thực tế trong kinh doanh, y tế và khoa học.',
    image: getAssetUrl('it-ml.jpg'),
    createdAt: '2024-04-05T09:00:00Z',
    likes: 210,
    comments: [
      { id: 'itc1-1', author: 'Nguyễn Gia Bảo', text: 'ML thật sự là tương lai của phân tích dữ liệu!', timestamp: '2024-04-05T10:30:00Z' },
      { id: 'itc1-2', author: 'Trình Trung Hiếu', text: 'Bài viết rất hay, tôi đang học về chủ đề này.', timestamp: '2024-04-06T11:00:00Z' },
      { id: 'itc1-3', author: 'Lê Anh Tuấn', text: 'Phân tích rất sâu sắc, cảm ơn tác giả!', timestamp: '2024-04-07T14:00:00Z' },
    ],
  },
  {
    id: 'it-post-2',
    title: 'Phát triển Web với Vue.js và API RESTful',
    fullContent: 'Vue.js là một framework JavaScript lũy tiến để xây dựng giao diện người dùng, đặc biệt mạnh mẽ khi kết hợp với API RESTful. Bài viết này hướng dẫn bạn cách xây dựng một ứng dụng web hiện đại, từ việc thiết lập dự án Vue đến kết nối với backend thông qua các yêu cầu HTTP. Chúng ta sẽ tìm hiểu về các khái niệm như thành phần, quản lý trạng thái và định tuyến, cùng với việc xử lý dữ liệu từ API một cách hiệu quả.',
    image: getAssetUrl('it-vue.jpg'),
    createdAt: '2024-04-10T11:20:00Z',
    likes: 180,
    comments: [
      { id: 'itc2-1', author: 'Võ Trần An Sang', text: 'Vue.js là lựa chọn tuyệt vời cho dự án của tôi!', timestamp: '2024-04-10T13:00:00Z' },
      { id: 'itc2-2', author: 'Lê Anh Tuấn', text: 'Tôi luôn tìm kiếm các tài liệu về Vue.js, cảm ơn.', timestamp: '2024-04-11T09:00:00Z' },
    ],
  },
  {
    id: 'it-post-3',
    title: 'Giới thiệu về Lập trình Bất đồng bộ trong JavaScript',
    fullContent: 'Lập trình bất đồng bộ là một khái niệm cốt lõi trong JavaScript hiện đại, đặc biệt quan trọng khi làm việc với các tác vụ yêu cầu thời gian như gọi API, đọc tệp hoặc tương tác với cơ sở dữ liệu. Bài viết này giải thích các phương pháp khác nhau để xử lý bất đồng bộ, bao gồm Callbacks, Promises và Async/Await, giúp bạn viết mã sạch hơn và dễ quản lý hơn. Hiểu rõ về bất đồng bộ sẽ nâng cao đáng kể kỹ năng lập trình JavaScript của bạn.',
    image: getAssetUrl('it-async.jpg'),
    createdAt: '2024-04-15T14:00:00Z',
    likes: 155,
    comments: [
      { id: 'itc3-1', author: 'Nguyễn Gia Bảo', text: 'Promise và Async/Await đã thay đổi cách tôi code.', timestamp: '2024-04-15T15:30:00Z' },
      { id: 'itc3-2', author: 'Trình Trung Hiếu', text: 'Giải thích rất rõ ràng, cảm ơn!', timestamp: '2024-04-16T10:00:00Z' },
    ],
  },
  {
    id: 'it-post-4',
    title: 'Bảo mật Web: Các Lỗ hổng Thường gặp và Cách Phòng tránh',
    fullContent: 'Bảo mật web là yếu tố tối quan trọng đối với mọi ứng dụng trực tuyến. Bài viết này tập trung vào các lỗ hổng bảo mật phổ biến như XSS (Cross-Site Scripting), SQL Injection và CSRF (Cross-Site Request Forgery), cung cấp kiến thức nền tảng để bạn hiểu rõ cách chúng hoạt động. Đồng thời, chúng tôi sẽ đưa ra các biện pháp phòng tránh hiệu quả, từ việc xác thực đầu vào đến sử dụng các tiêu đề bảo mật HTTP, giúp bạn xây dựng các ứng dụng web an toàn hơn.',
    image: getAssetUrl('it-security.jpg'),
    createdAt: '2024-04-20T10:00:00Z',
    likes: 190,
    comments: [
      { id: 'itc4-1', author: 'Lê Anh Tuấn', text: 'Kiến thức bảo mật là không bao giờ thừa.', timestamp: '2024-04-20T11:30:00Z' },
      { id: 'itc4-2', author: 'Võ Trần An Sang', text: 'Rất cần thiết cho các nhà phát triển web!', timestamp: '2024-04-21T09:00:00Z' },
    ],
  },
  {
    id: 'it-post-5',
    title: 'Tương lai của AI: Beyond ChatGPT và Học sâu',
    fullContent: 'Trí tuệ nhân tạo (AI) đang phát triển với tốc độ chóng mặt, và những gì chúng ta thấy ở ChatGPT hay các mô hình học sâu (Deep Learning) chỉ là phần nổi của tảng băng chìm. Bài viết này khám phá các xu hướng mới nổi trong AI, từ AI tổng quát (AGI) đến AI có thể giải thích (Explainable AI - XAI), và cách chúng có thể định hình tương lai của công nghệ và xã hội. Chúng ta sẽ thảo luận về những thách thức đạo đức và tiềm năng đột phá của các công nghệ AI tiên tiến.',
    image: getAssetUrl('it-ai-future.jpg'),
    createdAt: '2024-04-25T16:00:00Z',
    likes: 250,
    comments: [
      { id: 'itc5-1', author: 'Nguyễn Gia Bảo', text: 'Bài viết kích thích tư duy, rất thú vị.', timestamp: '2024-04-25T17:30:00Z' },
      { id: 'itc5-2', author: 'Trình Trung Hiếu', text: 'Tương lai của AI thật đáng để mong đợi!', timestamp: '2024-04-26T10:00:00Z' },
    ],
  },
  // Các bài viết cũ được giữ nguyên thứ tự
  {
    id: 'dummy-post-1',
    title: 'Khám phá Vẻ đẹp của Vịnh Hạ Long',
    fullContent: 'Vịnh Hạ Long, một Di sản Thế giới được UNESCO công nhận, nổi tiếng với hàng nghìn hòn đảo đá vôi và các cột đá nguyên khối hùng vĩ nhô lên từ làn nước xanh ngọc bích. Nơi đây mang vẻ đẹp siêu thực, hấp dẫn du khách từ khắp nơi trên thế giới. Bài viết này sẽ đưa bạn qua những điểm đến nổi bật, từ Đảo Ti Tốp với bãi biển cát trắng và tầm nhìn toàn cảnh, đến Hang Sửng Sốt với những khối thạch nhũ và măng đá kỳ vĩ. Chúng ta cũng sẽ khám phá các làng chài truyền thống và tìm hiểu về cuộc sống của người dân địa phương. Hãy sẵn sàng cho một chuyến phiêu lưu không thể quên tại một trong những kỳ quan thiên nhiên đẹp nhất thế giới!',
    image: getAssetUrl('blog-ha-long.jpg'),
    createdAt: '2023-10-26T10:00:00Z',
    likes: 135,
    comments: [
      { id: 'c1-1', author: 'Đặng Văn Long', text: 'Bài viết rất hay, Vịnh Hạ Long thật đẹp!', timestamp: '2023-10-26T11:00:00Z' },
      { id: 'c1-2', author: 'Lê Anh Tuấn', text: 'Cảm ơn bạn đã chia sẻ những trải nghiệm tuyệt vời!', timestamp: '2023-10-26T12:00:00Z' },
      { id: 'c1-3', author: 'Phạm Thị Mai', text: 'Phong cảnh tuyệt vời! Ước gì được đến đó một lần.', timestamp: '2023-10-26T14:30:00Z' },
      { id: 'c1-4', author: 'Nguyễn Gia Bảo', text: 'Bài viết chi tiết và hình ảnh rất đẹp.', timestamp: '2023-10-27T09:15:00Z' },
      { id: 'c1-5', author: 'Trình Trung Hiếu', text: 'Vịnh Hạ Long là một trong những nơi đẹp nhất tôi từng đến!', timestamp: '2023-10-27T14:00:00Z' },
      { id: 'c1-6', author: 'Võ Trần An Sang', text: 'Rất muốn quay lại Vịnh Hạ Long lần nữa.', timestamp: '2023-10-28T08:30:00Z' },
      { id: 'c1-7', author: 'Phạm Thị Mai', text: 'Cảm ơn bài viết bổ ích này!', timestamp: '2023-10-28T16:00:00Z' },
    ],
  },
  {
    id: 'dummy-post-2',
    title: 'Sài Gòn: Sự Pha trộn Giữa Hiện đại và Truyền thống',
    fullContent: 'Thành phố Hồ Chí Minh, hay còn gọi là Sài Gòn, là trung tâm kinh tế và văn hóa sôi động của Việt Nam. Nơi đây là sự kết hợp hài hòa giữa những tòa nhà chọc trời hiện đại và kiến trúc thuộc địa Pháp cổ kính, mang đến một cái nhìn độc đáo về lịch sử và sự phát triển của thành phố. Từ Nhà thờ Đức Bà, Bưu điện Trung tâm, đến Chợ Bến Thành và Bảo tàng Chứng tích Chiến tranh, mỗi địa điểm đều kể một câu chuyện riêng. Khám khám những con hẻm nhỏ với ẩm thực đường phố phong phú và trải nghiệm cuộc sống về đêm sôi động của thành phố không ngủ này.',
    image: getAssetUrl('blog-hcm.jpg'),
    createdAt: '2023-11-15T11:30:00Z',
    likes: 98,
    comments: [
      { id: 'c2-1', author: 'Phạm Thị Mai', text: 'Sài Gòn năng động và quyến rũ!', timestamp: '2023-11-15T13:00:00Z' },
      { id: 'c2-2', author: 'Trình Trung Hiếu', text: 'Thành phố không ngủ của tôi!', timestamp: '2023-11-16T10:00:00Z' },
      { id: 'c2-3', author: 'Đặng Văn Long', text: 'Ẩm thực đường phố Sài Gòn thật tuyệt vời.', timestamp: '2023-11-16T15:45:00Z' },
      { id: 'c2-4', author: 'Lê Anh Tuấn', text: 'Nhất định phải thử Bún bò Nam Bộ ở Sài Gòn!', timestamp: '2023-11-17T09:00:00Z' },
    ],
  },
  {
    id: 'dummy-post-3',
    title: 'Ẩm thực Đường phố Hà Nội: Một Hành trình Khám phá Hương vị',
    fullContent: 'Hà Nội không chỉ là thủ đô của Việt Nam mà còn là thiên đường của ẩm thực đường phố. Từ phở nóng hổi đến bún chả thơm lừng, mỗi món ăn đều kể một câu chuyện về văn hóa và con người Hà Nội. Hãy sẵn sàng cho một cuộc phiêu lưu ẩm thực không thể quên! Chúng ta sẽ thử món Phở Bò truyền thống, Bún Chả nướng thơm lừng, Bánh Mì giòn tan, và khám phá những quán cà phê trứng độc đáo. Mỗi góc phố đều ẩn chứa một hương vị đặc trưng, chờ đợi bạn khám phá và thưởng thức.',
    image: getAssetUrl('blog-ha-noi.jpg'),
    createdAt: '2023-12-01T14:45:00Z',
    likes: 142,
    comments: [
      { id: 'c3-1', author: 'Nguyễn Gia Bảo', text: 'Phở Hà Nội là số 1!', timestamp: '2023-12-01T15:30:00Z' },
      { id: 'c3-2', author: 'Đặng Văn Long', text: 'Ước gì được thử hết các món này.', timestamp: '2023-12-01T16:00:00Z' },
      { id: 'c3-3', author: 'Lê Anh Tuấn', text: 'Cà phê trứng là phải thử khi đến Hà Nội!', timestamp: '2023-12-02T09:00:00Z' },
      { id: 'c3-4', author: 'Võ Trần An Sang', text: 'Bún chả thật sự rất ngon, nhớ mãi hương vị.', timestamp: '2023-12-02T11:20:00Z' },
      { id: 'c3-5', author: 'Phạm Thị Mai', text: 'Tuyệt vời, tôi yêu ẩm thực Hà Nội!', timestamp: '2023-12-03T10:00:00Z' },
    ],
  },
  {
    id: 'dummy-post-4',
    title: 'Đà Nẵng: Thành phố của những cây cầu và bãi biển',
    fullContent: 'Đà Nẵng là một thành phố ven biển tuyệt đẹp nổi tiếng với những cây cầu độc đáo như Cầu Rồng và Cầu Vàng, cùng với những bãi biển cát trắng mịn như Mỹ Khê. Đây là điểm đến lý tưởng cho cả du lịch thư giãn và khám phá văn hóa địa phương.',
    image: getAssetUrl('blog-da-nang.jpg'),
    createdAt: '2024-01-05T09:10:00Z',
    likes: 80,
    comments: [
      { id: 'c4-1', author: 'Phạm Thị Mai', text: 'Cầu Vàng nhìn đẹp mê hồn quá!', timestamp: '2024-01-05T10:30:00Z' },
      { id: 'c4-2', author: 'Đặng Văn Long', text: 'Biển Mỹ Khê là bãi biển yêu thích của tôi.', timestamp: '2024-01-06T08:00:00Z' },
      { id: 'c4-3', author: 'Lê Anh Tuấn', text: 'Đà Nẵng là thành phố đáng sống!', timestamp: '2024-01-07T13:00:00Z' },
    ],
  },
  {
    id: 'dummy-post-5',
    title: 'Áo dài Việt Nam: Biểu tượng văn hóa vượt thời gian',
    fullContent: 'Áo dài, trang phục truyền thống của Việt Nam, không chỉ là một bộ quần áo mà còn là biểu tượng của vẻ đẹp, sự duyên dáng và bản sắc văn hóa dân tộc. Bài viết này khám phá lịch sử, sự phát triển và ý nghĩa của áo dài trong đời sống hiện đại.',
    image: getAssetUrl('blog-ao-dai.jpg'),
    createdAt: '2024-02-14T16:20:00Z',
    likes: 75,
    comments: [
      { id: 'c5-1', author: 'Trình Trung Hiếu', text: 'Áo dài thật sự rất thanh lịch và đẹp.', timestamp: '2024-02-15T09:00:00Z' },
      { id: 'c5-2', author: 'Đặng Văn Long', text: 'Tự hào về văn hóa Việt Nam!', timestamp: '2024-02-16T11:00:00Z' },
    ],
  },
  {
    id: 'dummy-post-6',
    title: 'Tết Nguyên Đán: Lễ hội truyền thống lớn nhất Việt Nam',
    fullContent: 'Tết Nguyên Đán, hay còn gọi là Tết, là lễ hội quan trọng nhất trong văn hóa Việt Nam. Đây là dịp để gia đình sum họp, tưởng nhớ tổ tiên và cầu mong những điều tốt đẹp cho năm mới. Tìm hiểu về những phong tục, món ăn và không khí đặc trưng của ngày Tết.',
    image: getAssetUrl('blog-tet.jpg'),
    createdAt: '2024-03-01T08:00:00Z',
    likes: 150,
    comments: [
      { id: 'c6-1', author: 'Nguyễn Gia Bảo', text: 'Không khí Tết thật ấm áp và ý nghĩa.', timestamp: '2024-03-01T09:30:00Z' },
      { id: 'c6-2', author: 'Lê Anh Tuấn', text: 'Chúc mừng năm mới an lành!', timestamp: '2024-03-01T10:00:00Z' },
      { id: 'c6-3', author: 'Võ Trần An Sang', text: 'Rất thích các món ăn truyền thống ngày Tết.', timestamp: '2024-03-02T11:00:00Z' },
      { id: 'c6-4', author: 'Đặng Văn Long', text: 'Tết là dịp tuyệt vời để sum vầy gia đình.', timestamp: '2024-03-03T15:00:00Z' },
    ],
  },
];

const defaultVideos = [
  {
    id: 'dummy-video-1',
    title: 'Hướng dẫn Du lịch Việt Nam',
    description: 'Video giới thiệu những địa điểm du lịch tuyệt đẹp và trải nghiệm văn hóa độc đáo tại Việt Nam. Khám phá phong cảnh hùng vĩ và con người thân thiện.',
    url: 'https://www.youtube.com/watch?v=PSqscwxujno', 
    thumbnail: getAssetUrl('thumb-vietnam.jpg'),
    createdAt: '2023-10-20T09:00:00Z',
    likes: 68,
    comments: [
      { id: 'vc1-1', author: 'Lê Anh Tuấn', text: 'Video rất hữu ích!', timestamp: '2023-10-20T10:00:00Z' },
      { id: 'vc1-2', author: 'Võ Trần An Sang', text: 'Cảnh đẹp quá, muốn đi ngay!', timestamp: '2023-10-20T11:00:00Z' },
      { id: 'vc1-3', author: 'Phạm Thị Mai', text: 'Tuyệt vời, Việt Nam đẹp quá!', timestamp: '2023-10-20T15:00:00Z' },
    ],
  },
  {
    id: 'dummy-video-2',
    title: 'Top 10 Món Ăn Đường Phố Việt Nam',
    description: 'Đắm chìm vào thế giới ẩm thực đường phố Việt Nam với 10 món ăn không thể bỏ qua. Video này sẽ khiến bạn phải thèm thuồng!',
    url: 'https://www.youtube.com/watch?v=EBvOPonFExQ', 
    thumbnail: getAssetUrl('thumb-food.jpg'),
    createdAt: '2023-11-10T10:15:00Z',
    likes: 85,
    comments: [
      { id: 'vc2-1', author: 'Phạm Thị Mai', text: 'Thấy đói bụng ngay lập tức!', timestamp: '2023-11-10T12:00:00Z' },
      { id: 'vc2-2', author: 'Nguyễn Gia Bảo', text: 'Món ăn nào cũng hấp dẫn!', timestamp: '2023-11-11T09:00:00Z' },
      { id: 'vc2-3', author: 'Đặng Văn Long', text: 'Phải thử hết mới được!', timestamp: '2023-11-11T14:30:00Z' },
    ],
  },
  {
    id: 'dummy-video-3',
    title: 'Cuộc sống về đêm tại Hà Nội',
    description: 'Trải nghiệm sự sôi động của Hà Nội về đêm với những khu chợ đêm, quán bar và nhà hàng truyền thống. Một chuyến phiêu lưu đầy màu sắc.',
    url: 'https://www.youtube.com/watch?v=iRi0LE-eryw', 
    thumbnail: getAssetUrl('thumb-hanoi-night.jpg'),
    createdAt: '2023-11-28T12:00:00Z',
    likes: 65,
    comments: [
      { id: 'vc3-1', author: 'Võ Trần An Sang', text: 'Hà Nội về đêm có sức hút kỳ lạ.', timestamp: '2023-11-28T14:00:00Z' },
      { id: 'vc3-2', author: 'Trình Trung Hiếu', text: 'Quang cảnh thật tuyệt vời!', timestamp: '2023-11-29T10:00:00Z' },
    ],
  },
  {
    id: 'dummy-video-4',
    title: 'Hội An: Thành phố cổ kính và lãng mạn',
    description: 'Khám phá vẻ đẹp cổ kính và lãng mạn của Hội An với những con phố đèn lồng, kiến trúc độc đáo và ẩm thực đa dạng. Một trải nghiệm khó quên.',
    url: 'https://www.youtube.com/watch?v=puFpXzGIwb8', 
    thumbnail: getAssetUrl('thumb-hoi-an.jpg'),
    createdAt: '2024-01-15T09:30:00Z',
    likes: 72,
    comments: [
      { id: 'vc4-1', author: 'Đặng Văn Long', text: 'Hội An lung linh quá!', timestamp: '2024-01-15T11:00:00Z' },
      { id: 'vc4-2', author: 'Lê Anh Tuấn', text: 'Rất thích không khí ở đây.', timestamp: '2024-01-16T09:00:00Z' },
    ],
  },
  {
    id: 'dummy-video-5',
    title: 'Âm nhạc truyền thống Việt Nam: Những giai điệu tâm hồn',
    description: 'Đắm mình vào thế giới âm nhạc truyền thống Việt Nam với các loại nhạc cụ độc đáo và những giai điệu sâu lắng, thể hiện tâm hồn và văn hóa dân tộc.',
    url: 'https://www.youtube.com/shorts/eg9KtjaTxs8', 
    thumbnail: getAssetUrl('thumb-music.jpg'),
    createdAt: '2024-02-20T14:00:00Z',
    likes: 50,
    comments: [
      { id: 'vc5-1', author: 'Phạm Thị Mai', text: 'Âm nhạc truyền thống thật hay và ý nghĩa.', timestamp: '2024-02-20T15:00:00Z' },
    ],
  },
  {
    id: 'dummy-video-6',
    title: 'Văn hóa cà phê Việt Nam: Từ phin tới tách',
    description: 'Tìm hiểu về văn hóa cà phê đặc trưng của Việt Nam, từ cách pha phin truyền thống đến những quán cà phê độc đáo và hương vị đậm đà đã làm nên tên tuổi.',
    url: 'https://www.youtube.com/watch?v=lfqPVeNzVXI', 
    thumbnail: getAssetUrl('thumb-coffee.jpg'),
    createdAt: '2024-03-10T11:45:00Z',
    likes: 77,
    comments: [
      { id: 'vc6-1', author: 'Nguyễn Gia Bảo', text: 'Yêu cà phê Việt Nam!', timestamp: '2024-03-10T12:00:00Z' },
      { id: 'vc6-2', author: 'Đặng Văn Long', text: 'Thật tự hào về văn hóa cà phê của chúng ta.', timestamp: '2024-03-11T10:00:00Z' },
    ],
  },
  // Các video mới về IT, lập trình, AI
  {
    id: 'it-video-1',
    title: 'Hướng dẫn Cơ bản về Python cho Người mới bắt đầu',
    description: 'Video này cung cấp một cái nhìn tổng quan toàn diện về Python, từ cú pháp cơ bản đến các khái niệm lập trình nâng cao. Lý tưởng cho những ai muốn bắt đầu hành trình lập trình của mình.',
    url: 'https://www.youtube.com/watch?v=oFgg7K2tpfk&list=PLKzXIbeO5pQ0J2boMB4btE7VDs7gP8vdl',
    thumbnail: getAssetUrl('thumb-python-intro.jpg'),
    createdAt: '2024-05-01T10:00:00Z',
    likes: 120,
    comments: [
      { id: 'vit1-1', author: 'Trình Trung Hiếu', text: 'Video rất hữu ích cho người mới học Python!', timestamp: '2024-05-01T11:00:00Z' },
      { id: 'vit1-2', author: 'Nguyễn Gia Bảo', text: 'Giải thích dễ hiểu, cảm ơn.', timestamp: '2024-05-02T09:00:00Z' },
    ],
  },
  {
    id: 'it-video-2',
    title: 'Xây dựng Ứng dụng Web đơn giản với React',
    description: 'Học cách xây dựng một ứng dụng web frontend tương tác bằng React.js. Video này bao gồm các chủ đề từ thiết lập môi trường đến quản lý trạng thái và tương tác với API.',
    url: 'https://www.youtube.com/watch?v=Up3YNeLA6MQ',
    thumbnail: getAssetUrl('thumb-react-app.jpg'),
    createdAt: '2024-05-05T14:30:00Z',
    likes: 95,
    comments: [
      { id: 'vit2-1', author: 'Võ Trần An Sang', text: 'React là tương lai, cảm ơn video này!', timestamp: '2024-05-05T16:00:00Z' },
      { id: 'vit2-2', author: 'Lê Anh Tuấn', text: 'Rất cần một hướng dẫn thực tế về React!', timestamp: '2024-05-06T10:00:00Z' },
    ],
  },
  {
    id: 'it-video-3',
    title: 'Tìm hiểu về Mạng nơ-ron: Kiến trúc và Ứng dụng',
    description: 'Đi sâu vào thế giới của mạng nơ-ron, trái tim của học sâu. Video này giải thích kiến trúc, cơ chế hoạt động và các ứng dụng thực tế trong thị giác máy tính và xử lý ngôn ngữ tự nhiên.',
    url: 'https://www.youtube.com/watch?v=sWPNm_GhhCA',
    thumbnail: getAssetUrl('thumb-neural-nets.jpg'),
    createdAt: '2024-05-10T09:15:00Z',
    likes: 150,
    comments: [
      { id: 'vit3-1', author: 'Nguyễn Gia Bảo', text: 'Mạng nơ-ron thật phức tạp nhưng rất thú vị.', timestamp: '2024-05-10T10:45:00Z' },
      { id: 'vit3-2', author: 'Trình Trung Hiếu', text: 'Giải thích rất rõ ràng về các khái niệm khó.', timestamp: '2024-05-11T12:00:00Z' },
    ],
  },
  {
    id: 'it-video-4',
    title: 'DevOps Essentials: CI/CD Pipeline',
    description: 'Khám phá các nguyên tắc cơ bản của DevOps và cách xây dựng một quy trình CI/CD (Continuous Integration/Continuous Delivery) hiệu quả. Tối ưu hóa quá trình phát triển phần mềm của bạn.',
    url: 'https://www.youtube.com/watch?v=scEDHsr3APg',
    thumbnail: getAssetUrl('thumb-devops.jpg'),
    createdAt: '2024-05-15T11:00:00Z',
    likes: 88,
    comments: [
      { id: 'vit4-1', author: 'Lê Anh Tuấn', text: 'DevOps giúp cải thiện quy trình làm việc rất nhiều.', timestamp: '2024-05-15T12:30:00Z' },
      { id: 'vit4-2', author: 'Võ Trần An Sang', text: 'Rất cần thiết cho các đội phát triển hiện đại.', timestamp: '2024-05-16T09:30:00Z' },
    ],
  },
  {
    id: 'it-video-5',
    title: 'Giới thiệu về Cloud Computing và AWS',
    description: 'Hiểu về điện toán đám mây và dịch vụ AWS hàng đầu. Video này sẽ giúp bạn nắm bắt các khái niệm cơ bản về đám mây, các mô hình dịch vụ (IaaS, PaaS, SaaS) và cách bắt đầu với AWS.',
    url: 'https://www.youtube.com/watch?v=fJcWwVP3vsI',
    thumbnail: getAssetUrl('thumb-cloud-aws.jpg'),
    createdAt: '2024-05-20T10:00:00Z',
    likes: 110,
    comments: [
      { id: 'vit5-1', author: 'Trình Trung Hiếu', text: 'AWS có quá nhiều dịch vụ, video này tóm tắt tốt.', timestamp: '2024-05-20T11:30:00Z' },
      { id: 'vit5-2', author: 'Nguyễn Gia Bảo', text: 'Điện toán đám mây là xu hướng không thể bỏ qua.', timestamp: '2024-05-21T08:45:00Z' },
    ],
  },
  {
    id: 'it-video-6',
    title: 'Thực hành Lập trình Thuật toán và Cấu trúc Dữ liệu',
    description: 'Nâng cao kỹ năng giải quyết vấn đề của bạn bằng cách thực hành các thuật toán và cấu trúc dữ liệu cơ bản. Video này cung cấp các ví dụ thực tế và giải thích chi tiết.',
    url: 'https://www.youtube.com/watch?v=HmA2gjp5wWI&t=763s',
    thumbnail: getAssetUrl('thumb-algo-ds.jpg'),
    createdAt: '2024-05-25T15:00:00Z',
    likes: 130,
    comments: [
      { id: 'vit6-1', author: 'Lê Anh Tuấn', text: 'Cấu trúc dữ liệu và thuật toán rất quan trọng!', timestamp: '2024-05-25T16:30:00Z' },
      { id: 'vit6-2', author: 'Võ Trần An Sang', text: 'Cần luyện tập thường xuyên chủ đề này.', timestamp: '2024-05-26T10:00:00Z' },
    ],
  },
];


const defaultBanners = [
  { id: 'banner-1', image: getAssetUrl('banner1.jpg'), alt: 'banner1' },
  { id: 'banner-2', image: getAssetUrl('banner2.jpg'), alt: 'banner2' },
  { id: 'banner-3', image: getAssetUrl('banner3.jpg'), alt: 'banner3' },
  { id: 'banner-4', image: getAssetUrl('banner4.jpg'), alt: 'banner4' },
  { id: 'banner-5', image: getAssetUrl('banner5.jpg'), alt: 'banner5' },
  { id: 'banner-6', image: getAssetUrl('banner6.jpg'), alt: 'banner6' },
];

const defaultSharedPosts = []; // New: Mảng rỗng mặc định cho các bài viết đã chia sẻ


// Hàm tải dữ liệu từ localStorage
const loadData = (key, defaultValue) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (e) {
    console.error(`Lỗi khi tải dữ liệu từ localStorage cho khóa "${key}":`, e);
    return defaultValue;
  }
};

// Hàm lưu dữ liệu vào localStorage
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Lỗi khi lưu dữ liệu vào localStorage cho khóa "${key}":`, e);
  }
};

// Khởi tạo refs bằng cách tải từ localStorage (nếu có) hoặc dùng dữ liệu mặc định
export const posts = ref(loadData(STORAGE_KEY_POSTS, defaultPosts));
export const videos = ref(loadData(STORAGE_KEY_VIDEOS, defaultVideos));
export const users = ref(loadData(STORAGE_KEY_USERS, defaultUsers));
export const banners = ref(loadData(STORAGE_KEY_BANNERS, defaultBanners));
export const sharedPosts = ref(loadData(STORAGE_KEY_SHARED_POSTS, defaultSharedPosts)); // Export sharedPosts ref

// Theo dõi thay đổi của refs để tự động lưu vào localStorage
watch(posts, (newVal) => {
  saveData(STORAGE_KEY_POSTS, newVal);
}, { deep: true });

watch(videos, (newVal) => {
  saveData(STORAGE_KEY_VIDEOS, newVal);
}, { deep: true });

watch(users, (newVal) => {
  saveData(STORAGE_KEY_USERS, newVal);
}, { deep: true });

watch(banners, (newVal) => {
  saveData(STORAGE_KEY_BANNERS, newVal);
}, { deep: true });

watch(sharedPosts, (newVal) => { // Watch for changes in sharedPosts and save
  saveData(STORAGE_KEY_SHARED_POSTS, newVal);
}, { deep: true });


console.log("Dữ liệu tĩnh đã được tải/khởi tạo. Các thay đổi sẽ được lưu vào localStorage.");
