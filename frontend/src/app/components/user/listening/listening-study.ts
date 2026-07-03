import { Component, inject, OnInit, OnDestroy, signal, computed, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListeningService, ListeningSection, ListeningQuestion, RewardResult } from '../../../services/listening.service';
import { ToastService } from '../../../services/toast.service';
import { TtsService } from '../../../services/tts.service';

interface ChatMessage {
  speaker: string;
  message: string;
  isLeft: boolean;
}

// Translation dictionary for A1 Vietnamese questions & options to English
const TRANSLATION_MAP: { [key: string]: string } = {
  // Topics: Greeting a New Neighbor
  'Ai là người mới chuyển đến sống cạnh John?': 'Who just moved in next to John?',
  'John': 'John',
  'Lisa': 'Lisa',
  'Một người hàng xóm khác': 'Another neighbor',
  'Người quản lý tòa nhà': 'The building manager',
  'Lisa là người mới chuyển đến sống cạnh John.': 'Lisa is the one who just moved in next to John.',
  
  'John cảm thấy thế nào về việc chuyển đến nhà mới?': 'How does John feel about moving to the new house?',
  'Tired': 'Tired',
  'Hạnh phúc': 'Happy',
  'Buồn': 'Sad',
  'Không có cảm giác gì': 'No feeling',
  'John cảm thấy mệt mỏi vì việc chuyển đến nhà mới.': 'John feels tired because of the move today.',
  
  'Lisa có giúp đỡ John gì không?': 'Does Lisa offer any help to John?',
  'Đi mua sắm': 'Go shopping',
  'Đi làm': 'Go to work',
  'Đóng gói đồ đạc': 'Pack things',
  'Đóng gói đồ đạc và giúp đỡ John': 'Helping John unpack',
  'Lisa đề nghị giúp đỡ John đóng gói đồ đạc và giúp đỡ John.': 'Lisa offers to help John unpack his things.',
  
  'John có cần giúp đỡ gì không?': 'Does John need any help?',
  'Có, tôi cần giúp đỡ': 'Yes, I need help',
  'Không, tôi không cần giúp đỡ': "No, thanks. I'm good.",
  'Có thể, nhưng tôi không cần giúp đỡ ngay bây giờ': 'Maybe, but I do not need help right now',
  'Không biết': "Don't know",
  'John nói rằng không cần giúp đỡ.': "John says he is good and doesn't need help.",
  
  'John cảm thấy thế nào về việc sống ở khu phố mới?': 'How does John feel about living in the new neighborhood?',
  'Tốt': 'Good',
  'Khá': 'Fair',
  'Không tốt': 'Bad',
  'John nói rằng hạnh phúc khi sống ở khu phố mới.': 'John is glad to be in the new neighborhood.',

  // Topic: Asking for Directions to the Library
  'John đang tìm kiếm đâu?': 'Where is John looking for?',
  'Thư viện': 'The library',
  'Cửa hàng': 'The store',
  'Trạm xe buýt': 'The bus station',
  'Cafe': 'The cafe',
  'John đang tìm kiếm thư viện.': 'John is looking for the library.',
  
  'Lisa chỉ John đi trái hay phải?': 'Does Lisa tell John to turn left or right?',
  'Trái': 'Left',
  'Phải': 'Right',
  'Trên': 'Up',
  'Dưới': 'Down',
  'Lisa chỉ John đi trái tại đèn giao thông.': 'Lisa tells John to turn left at the traffic light.',
  
  'Thời gian để đi đến thư viện là bao lâu?': 'How long does it take to walk to the library?',
  '5 phút': '5 minutes',
  '10 phút': '10 minutes',
  '15 phút': '15 minutes',
  '20 phút': '20 minutes',
  'Lisa nói thời gian để đi đến thư viện là 5 phút.': 'Lisa says it is a five-minute walk.',
  
  'John cảm ơn Lisa bao nhiêu lần?': 'How many times does John thank Lisa?',
  '1 lần': 'Once',
  '2 lần': 'Twice',
  '3 lần': 'Three times',
  '4 lần': 'Four times',
  'John cảm ơn Lisa 2 lần trong cuộc trò chuyện.': 'John thanks Lisa twice during the conversation.',
  
  'Đường đến thư viện có khó khăn không?': 'Is the way to the library difficult?',
  'Khó': 'Difficult',
  'Dễ': 'Easy',
  'Trung bình': 'Moderate',
  'Không rõ': 'Unclear',
  'Lisa nói đường đến thư viện chỉ cần đi 5 phút.': 'Lisa shows a very simple path that takes only 5 minutes.',

  // Topic: Ordering Food at a Café
  'John muốn uống gì?': 'What does John want to drink?',
  'Cài phê': 'Coffee',
  'Cà phê': 'Coffee',
  'Nước': 'Water',
  'Trà': 'Tea',
  'Soda': 'Soda',
  'John muốn uống cà phê.': 'John wants to order a coffee.',
  
  'John muốn ăn gì?': 'What does John want to eat?',
  'Ham và phô mai': 'Ham and cheese sandwich',
  'Thịt gà': 'Chicken',
  'Cá': 'Fish',
  'Trứng': 'Eggs',
  'John muốn ăn một sandwich ham và phô mai.': 'John wants a ham and cheese sandwich.',
  
  'John sẽ trả tiền bằng cách nào?': 'How will John pay for his order?',
  'Thẻ tín dụng': 'Card',
  'Tiền mặt': 'Cash',
  'Quẹt thẻ': 'Swipe card',
  'Đổi tiền': 'Exchange money',
  'John sẽ trả tiền bằng thẻ tín dụng.': 'John says he will pay with card.',
  
  'Giá của sandwich là bao nhiêu?': 'How much is the order / sandwich?',
  '$5.00': '$5.00',
  '$5.50': '$5.50',
  '$6.00': '$6.00',
  '$7.00': '$7.00',
  'Giá của sandwich là $5.50.': 'The total price is $5.50.',
  
  'Lisa hỏi John điều gì?': 'What does Lisa ask John?',
  'Anh muốn uống gì?': 'What would you like to drink?',
  'Anh muốn ăn gì?': 'What kind of sandwich would you like?',
  'Anh sẽ trả tiền bằng cách nào?': 'Would you like to pay with card or cash?',
  'Lisa hỏi John anh muốn ăn gì.': 'Lisa asks John what kind of sandwich he would like.',

  // Topic: Buying a Train Ticket
  'John muốn đi đến đâu?': 'Where is John travelling to?',
  'Manchester': 'Manchester',
  'London': 'London',
  'Birmingham': 'Birmingham',
  'Liverpool': 'Liverpool',
  'John muốn đi đến London.': 'John wants to buy a train ticket to London.',
  
  'Lịch trình của John là gì?': 'What is John\'s preferred schedule?',
  'Đi tàu vào buổi tối': 'Leave in the evening',
  'Đi tàu vào buổi sáng': 'Leave in the morning (at 9 am)',
  'Đi tàu vào buổi trưa': 'Leave at noon',
  'John muốn đi tàu vào buổi sáng.': 'John wants to leave at 9 am.',
  
  'Giá vé của John là bao nhiêu?': 'How much does the ticket cost?',
  '£40': '£40',
  '£50': '£50',
  '£60': '£60',
  '£70': '£70',
  'Giá vé của John là £50.': 'Lisa says the ticket will be £50.',
  
  'Lịch trình của anh ấy': 'His train schedule',
  'Giá vé của anh ấy': 'His ticket price',
  'Điểm đến của anh ấy': 'His destination',
  'Tất cả': 'All of the above',
  'Lisa hỏi John về lịch trình, giá vé và điểm đến.': 'Lisa asks John where he is coming from, his schedule, etc.',
  'John muốn mua vé tàu đến đâu?': 'Where does John want to buy a train ticket to?',
  'John muốn mua vé tàu đến London.': 'John wants to buy a train ticket to London.',

  // Topic: Weather Forecast Report
  'Hôm nay thời tiết sẽ như thế nào?': 'How is the weather forecast today?',
  'Nắng mưa': 'Rainy and sunny',
  'Nắng đẹp': 'Sunny',
  'Mưa gió': 'Rainy and windy',
  'Gió mạnh': 'Strong winds',
  'Hôm nay thời tiết sẽ nắng đẹp với nhiệt độ cao nhất 22 độ C.': 'Today is expected to be sunny with a high of 22 degrees Celsius.',
  
  'Nhiệt độ cao nhất hôm nay là bao nhiêu?': 'What is the high temperature today?',
  '20 độ C': '20 degrees Celsius',
  '22 độ C': '22 degrees Celsius',
  '25 độ C': '25 degrees Celsius',
  '30 độ C': '30 degrees Celsius',
  'Nhiệt độ cao nhất hôm nay là 22 độ C.': 'The expected high is 22 degrees Celsius.',
  
  'Hôm nay có gió không?': 'Will it be windy today?',
  'Có': 'Yes',
  'Không': 'No',
  'Không chắc chắn': 'Not sure',
  'Hôm nay sẽ có gió trong chiều tối.': 'It will be a bit windy in the afternoon.',
  
  'Nếu bạn đi làm, bạn nên chuẩn bị gì?': 'What should you bring if you go out / commute?',
  'Umbrella': 'An umbrella',
  'Găng tay': 'Gloves',
  'Đôi giày': 'Shoes',
  'Đôi kính': 'Glasses',
  'Nếu bạn đi làm, bạn nên chuẩn bị một chiếc ô để chống mưa.': 'John suggests not to forget your umbrella.',
  
  'Cảm ơn ai?': 'Who is being thanked / Who said goodbye?',
  'Cả hai': 'Both',
  'Không ai': 'No one',
  'Cảm ơn cả John và Lisa vì đã đưa ra thông tin thời tiết hôm nay.': 'Both John and Lisa presented the weather forecast.'
};

const TRANSCRIPT_TRANSLATION_MAP: { [key: string]: string } = {
  // Topic 1: Greeting a New Neighbor
  'greeting a new neighbor': `John: Xin chào, tôi là John. Tôi sống ở ngay nhà bên cạnh.
Lisa: Chào John, tôi là Lisa. Chào mừng anh đến với khu phố mới này nhé.
John: Cảm ơn cô, tôi rất vui khi được chuyển đến sống ở đây.
Lisa: Vậy việc dọn nhà hôm nay của anh thế nào rồi?
John: Cũng tạm ổn, nhưng có hơi mệt một chút.
Lisa: Rất tiếc khi nghe vậy. Anh có cần giúp đỡ dỡ và sắp xếp đồ đạc không?
John: Ồ không cần đâu, cảm ơn cô. Tôi tự lo được rồi.
Lisa: Được rồi, có cần giúp gì cứ bảo tôi nhé.
John: Cảm ơn cô nhiều nhé, Lisa.`,

  // Topic 2: Asking for Directions to the Library
  'asking for directions to the library': `John: Xin chào Lisa. Cô có thể chỉ đường giúp tôi đến thư viện không?
Lisa: Chào John. Tất nhiên rồi. Đầu tiên, anh đi thẳng con đường này.
John: Đi thẳng đúng không?
Lisa: Đúng vậy. Sau đó, rẽ trái ở ngã tư có đèn giao thông đầu tiên.
John: Rẽ trái tại đèn giao thông đầu tiên.
Lisa: Chính xác. Đi bộ thêm khoảng 2 phút nữa, anh sẽ thấy thư viện nằm ở phía bên phải, đối diện công viên.
John: Thư viện nằm bên phải, đối diện công viên. Đi bộ mất bao lâu từ đây nhỉ?
Lisa: Chỉ khoảng 5 phút đi bộ thôi anh.
John: Tuyệt quá. Cảm ơn cô rất nhiều nhé, Lisa.
Lisa: Không có gì đâu John. Chúc anh một ngày tốt lành!`,

  // Topic 3: Ordering Food at a Café
  'ordering food at a café': `Lisa: Chào mừng anh đến với quán cà phê Green. Tôi có thể giúp gì cho anh?
John: Chào cô. Cho tôi gọi một ly cà phê đen nhé.
Lisa: Anh muốn dùng cà phê nóng hay đá?
John: Cà phê nóng nhé.
Lisa: Được rồi. Anh có muốn dùng kèm bánh hay sandwich gì không?
John: Có, cho tôi một bánh sandwich giăm bông phô mai.
Lisa: Vâng, một sandwich giăm bông phô mai. Bánh này có giá là $5.50. Tổng cộng của anh là $7.50. Anh muốn thanh toán bằng thẻ hay tiền mặt?
John: Tôi thanh toán bằng thẻ nhé.
Lisa: Được rồi, anh vui lòng chạm thẻ ở đây. Cảm ơn anh.
John: Cảm ơn cô.`,
  'ordering food at a cafe': `Lisa: Chào mừng anh đến với quán cà phê Green. Tôi có thể giúp gì cho anh?
John: Chào cô. Cho tôi gọi một ly cà phê đen nhé.
Lisa: Anh muốn dùng cà phê nóng hay đá?
John: Cà phê nóng nhé.
Lisa: Được rồi. Anh có muốn dùng kèm bánh hay sandwich gì không?
John: Có, cho tôi một bánh sandwich giăm bông phô mai.
Lisa: Vâng, một sandwich giăm bông phô mai. Bánh này có giá là $5.50. Tổng cộng của anh là $7.50. Anh muốn thanh toán bằng thẻ hay tiền mặt?
John: Tôi thanh toán bằng thẻ nhé.
Lisa: Được rồi, anh vui lòng chạm thẻ ở đây. Cảm ơn anh.
John: Cảm ơn cô.`,

  // Topic 4: Buying a Train Ticket
  'buying a train ticket': `Lisa: Chào anh. Tôi có thể giúp gì cho anh?
John: Chào cô. Tôi muốn mua một vé tàu đi London.
Lisa: Anh muốn đi một chiều hay khứ hồi?
John: Vé một chiều thôi cô nhé.
Lisa: Anh muốn khởi hành vào thời gian nào? Có chuyến lúc 9h sáng và 2h chiều.
John: Cho tôi chuyến lúc 9h sáng nhé.
Lisa: Vâng, chuyến 9h sáng. Vé của anh có giá là £50. Anh thanh toán bằng tiền mặt hay thẻ?
John: Bằng thẻ nhé.
Lisa: Được rồi, anh vui lòng quẹt thẻ ở đây. Đây là vé của anh.
John: Cảm ơn cô.`,

  // Topic 5: Weather Forecast Report
  'weather forecast report': `John: Chào Lisa. Bản tin thời tiết hôm nay thế nào nhỉ?
Lisa: Chào John. Hôm nay thời tiết sẽ nắng đẹp, nhiệt độ cao nhất khoảng 22 độ C.
John: Nhiệt độ 22 độ C thì dễ chịu quá. Có gió nhiều không cô?
Lisa: Sẽ có gió nhẹ vào khoảng chiều tối thôi anh.
John: Tuyệt vời. Thế có mưa không nhỉ? Tôi có nên mang theo ô không?
Lisa: Có khả năng có mưa rào nhẹ vào cuối ngày, tốt nhất anh nên mang theo một chiếc ô nhỏ cho chắc chắn nhé.
John: Cảm ơn cô rất nhiều vì thông tin thời tiết hữu ích.
Lisa: Không có gì đâu John. Chúc anh một ngày tốt lành nhé!`
};

@Component({
  selector: 'app-listening-study',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-bg-main text-text-main p-3 md:p-5 flex flex-col relative overflow-hidden transition-colors duration-300 select-none">
      <!-- Decorative Glows -->
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Main Layout Wrapper -->
      <div class="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-10">
        
        <!-- ==================================================================== -->
        <!-- LEFT PANEL: STUDY MATERIAL & AUDIO (6 cols)                         -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-6 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl shadow-md flex flex-col h-[calc(100vh-5rem)] overflow-hidden">
          
          <!-- Header & Back Button -->
          <div class="p-4 border-b border-border-main/50 shrink-0">
            <button
              (click)="goBack()"
              class="flex items-center gap-1.5 text-[10px] font-bold text-text-muted hover:text-text-main transition-colors mb-3 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Kho luyện nghe
            </button>

            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <h3 class="text-sm font-black text-text-main leading-tight">{{ topicTitle() }}</h3>
                <p class="text-[10px] text-text-muted">Học phần luyện nghe trắc nghiệm</p>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-wider">
                {{ topicCategory() }}
              </span>
            </div>
          </div>

          <!-- TTS Audio Player Card -->
          <div class="px-4 py-3 bg-bg-input/20 border-b border-border-main/50 shrink-0">
            <div class="bg-bg-card border border-border-main rounded-xl p-3.5 flex items-center justify-between shadow-sm">
              <div class="flex items-center gap-3">
                <!-- Play/Pause Button -->
                <button
                  (click)="togglePlay()"
                  [class.bg-brand-primary]="!isPlaying()"
                  [class.bg-red-500]="isPlaying()"
                  class="w-10 h-10 rounded-full text-white font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center shrink-0 animate-pulse-light"
                >
                  @if (isPlaying()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  }
                </button>

                <!-- Voice / Play status text -->
                <div class="space-y-0.5 text-left">
                  <span class="text-[10px] font-black text-text-main block">Phát âm hội thoại (TTS Audio)</span>
                  <span class="text-[8px] text-text-muted font-bold block">
                    {{ isPlaying() ? 'Đang đọc hội thoại...' : 'Bấm phát để nghe đoạn audio' }}
                  </span>
                </div>
              </div>

              <!-- Speed and Wave visualizer -->
              <div class="flex items-center gap-4">
                <!-- Playback Speed -->
                <button 
                  (click)="cycleSpeed()"
                  class="px-2.5 py-1 bg-bg-input border border-border-main hover:bg-bg-card text-[9px] font-black rounded-lg cursor-pointer transition-colors"
                >
                  {{ playbackSpeed() }}x
                </button>

                <!-- Wave visualizer animation -->
                <div class="flex items-center gap-0.5 h-5 w-8 justify-center">
                  <span [class.animating]="isPlaying()" class="wave-bar" style="animation-delay: 0.1s"></span>
                  <span [class.animating]="isPlaying()" class="wave-bar" style="animation-delay: 0.3s"></span>
                  <span [class.animating]="isPlaying()" class="wave-bar" style="animation-delay: 0.5s"></span>
                  <span [class.animating]="isPlaying()" class="wave-bar" style="animation-delay: 0.2s"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Materials Tab Selection -->
          <div class="flex border-b border-border-main select-none font-bold text-[10px] shrink-0 bg-bg-input/10">
            <button
              (click)="activeMaterialTab.set('transcript')"
              [class.border-b-2]="activeMaterialTab() === 'transcript'"
              [class.border-brand-primary]="activeMaterialTab() === 'transcript'"
              [class.text-text-main]="activeMaterialTab() === 'transcript'"
              [class.text-text-muted]="activeMaterialTab() !== 'transcript'"
              class="flex-1 py-2.5 text-center cursor-pointer transition-all uppercase tracking-wider font-black"
            >
              Hội thoại tiếng Anh
            </button>
            <button
              (click)="activeMaterialTab.set('summary')"
              [class.border-b-2]="activeMaterialTab() === 'summary'"
              [class.border-brand-primary]="activeMaterialTab() === 'summary'"
              [class.text-text-main]="activeMaterialTab() === 'summary'"
              [class.text-text-muted]="activeMaterialTab() !== 'summary'"
              class="flex-1 py-2.5 text-center cursor-pointer transition-all uppercase tracking-wider font-black"
            >
              Tóm tắt tiếng Việt
            </button>
          </div>

          <!-- Materials content wrapper -->
          <div class="flex-1 overflow-y-auto p-4 min-h-0 bg-bg-input/5 relative">
            
            @if (!showTranscript()) {
              <!-- Transcript Hidden placeholder lock screen (Practice Listening) -->
              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fade-in bg-bg-card/90 backdrop-blur-sm z-20">
                <div class="w-14 h-14 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="space-y-1.5 max-w-xs">
                  <h4 class="text-xs font-black text-text-main">Văn bản hội thoại đã ẩn</h4>
                  <p class="text-[9.5px] text-text-muted leading-relaxed font-bold">
                    Nội dung văn bản được ẩn để giúp bạn tập trung luyện nghe tốt hơn. Hãy phát âm thanh, nghe và hoàn thành câu hỏi ở bên phải.
                  </p>
                </div>
                <button
                  (click)="showTranscript.set(true)"
                  class="px-4 py-2 bg-brand-primary text-white font-black text-xxs rounded-xl transition-all cursor-pointer shadow-md hover:opacity-90 active:scale-95"
                >
                  Hiển thị Transcript
                </button>
              </div>
            }

            @if (activeMaterialTab() === 'transcript') {
              <div class="space-y-3 animate-fade-in pr-1">
                <div class="flex justify-end mb-2">
                  <button 
                    (click)="showTranscript.set(false)" 
                    class="text-[9px] font-black text-brand-secondary/80 hover:text-brand-secondary transition-colors cursor-pointer"
                  >
                    Ẩn Transcript
                  </button>
                </div>
                
                @for (chat of parsedDialogues(); track $index) {
                  <div class="flex flex-col" [class.items-end]="!chat.isLeft" [class.items-start]="chat.isLeft">
                    @if (chat.speaker) {
                      <span class="text-[8px] font-black uppercase text-text-muted tracking-wider mb-1 px-1">
                        {{ chat.speaker }}
                      </span>
                    }
                    <div 
                      class="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs font-bold leading-relaxed shadow-sm transition-all text-left"
                      [class.bg-brand-primary/10]="chat.isLeft"
                      [class.text-brand-primary]="chat.isLeft"
                      [class.border]="chat.isLeft"
                      [class.border-brand-primary/20]="chat.isLeft"
                      [class.bg-bg-card]="!chat.isLeft"
                      [class.text-text-main]="!chat.isLeft"
                      [class.border-border-main]="!chat.isLeft"
                      [class.border]="!chat.isLeft"
                      [class.rounded-tl-none]="chat.isLeft"
                      [class.rounded-tr-none]="!chat.isLeft"
                    >
                      {{ chat.message }}
                    </div>
                  </div>
                } @empty {
                  <div class="text-center py-20 text-text-muted text-xs">Không có đoạn hội thoại tiếng Anh</div>
                }
              </div>
            } @else if (activeMaterialTab() === 'summary') {
              <div class="space-y-3 animate-fade-in pr-1">
                <div class="flex justify-end mb-2">
                  <button 
                    (click)="showTranscript.set(false)" 
                    class="text-[9px] font-black text-brand-secondary/80 hover:text-brand-secondary transition-colors cursor-pointer"
                  >
                    Ẩn Transcript
                  </button>
                </div>
                
                <div class="bg-bg-card border border-border-main rounded-2xl p-5 text-xs font-bold leading-relaxed text-text-main shadow-sm whitespace-pre-line text-left">
                  {{ summaryText() || 'Không có bản dịch tóm tắt cho bài này.' }}
                </div>
              </div>
            }
          </div>

        </div>

        <!-- ==================================================================== -->
        <!-- RIGHT PANEL: INTERACTIVE MULTIPLE-CHOICE QUIZ (6 cols)                -->
        <!-- ==================================================================== -->
        <div class="lg:col-span-6 backdrop-blur-xl bg-bg-card border border-border-main rounded-2xl p-5 md:p-6 shadow-md flex flex-col justify-between h-[calc(100vh-5rem)] overflow-hidden">
          
          @if (isLoading()) {
            <div class="flex-1 flex flex-col items-center justify-center space-y-4">
              <svg class="animate-spin h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-xs text-text-muted font-bold">Đang tải dữ liệu bài học...</p>
            </div>
          } @else if (showResults()) {
            <!-- Quiz Results Panel -->
            <div class="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 animate-fade-in">
              <div class="w-24 h-24 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 flex items-center justify-center shadow-inner">
                <span class="text-3xl font-black text-brand-primary">{{ correctAnswersCount() }} / {{ activeQuestions().length }}</span>
              </div>
              
              <div class="space-y-2">
                <h4 class="text-lg font-black text-text-main">
                  @if (correctAnswersCount() === activeQuestions().length) {
                    Excellent! 🎉
                  } @else if (correctAnswersCount() >= activeQuestions().length / 2) {
                    Great Job! 👍
                  } @else {
                    Keep Practicing! 💪
                  }
                </h4>
                <p class="text-xs text-text-muted max-w-sm mx-auto leading-relaxed font-bold">
                  You have finished the listening exercise and correctly answered {{ correctAnswersCount() }} questions.
                </p>
              </div>

              @if (earnedXp() > 0) {
                <div class="bg-brand-primary/5 border border-brand-primary/20 rounded-xl px-4 py-3 inline-flex items-center gap-1.5 text-xs font-black text-brand-primary">
                  <span>+{{ earnedXp() }} EXP</span>
                </div>
              }

              <div class="flex gap-3 w-full max-w-md pt-4">
                <button
                  (click)="restartQuiz()"
                  class="flex-1 py-3 bg-bg-input border border-border-main text-text-main font-black text-xs rounded-xl hover:bg-bg-card transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Retry Practice
                </button>
                <button
                  (click)="goBack()"
                  class="flex-1 py-3 bg-brand-primary text-white font-black text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  Other Lessons
                </button>
              </div>
            </div>
          } @else if (currentQuestion() && currentQuestion().id) {
            <!-- Question Quiz Header -->
            <div class="flex justify-between items-center pb-4 border-b border-border-main/50 shrink-0">
              <span class="text-xxs font-black text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2 py-0.5 rounded">
                Question {{ currentQuestionIndex() + 1 }} / {{ activeQuestions().length }}
              </span>
              <span class="text-xxs font-black text-text-muted">
                Completed: {{ getCompletedCount() }} / {{ activeQuestions().length }}
              </span>
            </div>

            <!-- Quiz Question body scroll area -->
            <div class="flex-1 overflow-y-auto py-5 pr-1 min-h-0 space-y-5">
              <!-- Question Text -->
              <h4 class="text-sm font-black text-text-main leading-snug text-left">
                {{ translateText(currentQuestion().text) }}
              </h4>

              <!-- Options list -->
              <div class="space-y-2.5">
                @for (opt of currentQuestion().options || []; track opt.key) {
                  <button
                    [disabled]="quizChecked()"
                    (click)="selectOption(opt.key)"
                    [class.border-brand-primary]="selectedOption() === opt.key && !quizChecked()"
                    [class.bg-brand-primary/5]="selectedOption() === opt.key && !quizChecked()"
                    [class.border-green-500]="quizChecked() && opt.key === currentQuestion().correctOption"
                    [class.bg-green-500/10]="quizChecked() && opt.key === currentQuestion().correctOption"
                    [class.text-green-600]="quizChecked() && opt.key === currentQuestion().correctOption"
                    [class.border-red-500]="quizChecked() && selectedOption() === opt.key && opt.key !== currentQuestion().correctOption"
                    [class.bg-red-500/10]="quizChecked() && selectedOption() === opt.key && opt.key !== currentQuestion().correctOption"
                    [class.text-red-500]="quizChecked() && selectedOption() === opt.key && opt.key !== currentQuestion().correctOption"
                    [class.hover:border-brand-primary/40]="!quizChecked()"
                    [class.border-border-main]="selectedOption() !== opt.key && (!quizChecked() || opt.key !== currentQuestion().correctOption)"
                    class="w-full text-left p-3.5 border rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-between cursor-pointer disabled:cursor-default disabled:opacity-90 select-none"
                  >
                    <div class="flex items-center gap-3 select-none">
                      <span 
                        [class.bg-brand-primary/10]="selectedOption() === opt.key && !quizChecked()"
                        [class.text-brand-primary]="selectedOption() === opt.key && !quizChecked()"
                        [class.bg-green-500]="quizChecked() && opt.key === currentQuestion().correctOption"
                        [class.!text-white]="quizChecked() && opt.key === currentQuestion().correctOption"
                        [class.bg-red-500]="quizChecked() && selectedOption() === opt.key && opt.key !== currentQuestion().correctOption"
                        [class.!text-white]="quizChecked() && selectedOption() === opt.key && opt.key !== currentQuestion().correctOption"
                        [class.bg-bg-input]="selectedOption() !== opt.key"
                        [class.text-text-muted]="selectedOption() !== opt.key"
                        class="w-6 h-6 rounded-lg text-xxs font-black flex items-center justify-center shrink-0 transition-colors select-none"
                      >
                        {{ opt.key }}
                      </span>
                      <span class="select-none">{{ translateText(opt.value) }}</span>
                    </div>

                    <!-- Icons indicator -->
                    @if (quizChecked()) {
                      @if (opt.key === currentQuestion().correctOption) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                      } @else if (selectedOption() === opt.key) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 shrink-0"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      }
                    }
                  </button>
                }
              </div>

              <!-- Explanation details box -->
              @if (quizChecked()) {
                <div class="bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl p-4 space-y-2 animate-fade-in text-left">
                  <div class="flex items-center gap-1.5 text-brand-secondary font-black text-xxs uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/></svg>
                    Giải thích đáp án
                  </div>
                  <p class="text-xxs font-bold text-text-muted leading-relaxed whitespace-pre-line">
                    {{ currentQuestion().translation || 'No explanation available.' }}
                  </p>
                </div>
              }
            </div>

            <!-- Quiz Actions Footer -->
            <div class="border-t border-border-main/50 pt-4 mt-auto flex gap-3 shrink-0">
              @if (!quizChecked()) {
                <button
                  (click)="checkAnswer()"
                  [disabled]="!selectedOption() || isSubmitting()"
                  class="flex-1 py-3 bg-brand-primary text-white font-black text-xs rounded-xl hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 transition-all cursor-pointer shadow-md active:scale-98 text-center flex items-center justify-center gap-1.5"
                >
                  Check Answer
                </button>
              } @else {
                @if (!quizIsCorrect()) {
                  <button
                    (click)="retryQuestion()"
                    class="flex-1 py-3 bg-bg-input border border-border-main text-text-main font-black text-xs rounded-xl hover:bg-bg-card transition-all cursor-pointer shadow-sm active:scale-98 text-center"
                  >
                    Retry Choice
                  </button>
                }
                
                <button
                  (click)="onNextAction()"
                  class="flex-1 py-3 bg-brand-primary text-white font-black text-xs rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md active:scale-98 text-center"
                >
                  {{ currentQuestionIndex() === activeQuestions().length - 1 ? 'Show Results' : 'Next Question' }}
                </button>
              }
            </div>
          } @else {
            <div class="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2 shrink-0">
              <h4 class="text-xs font-bold text-text-main">No questions found</h4>
              <p class="text-text-muted text-xxs">No quiz questions have been seeded for this topic.</p>
            </div>
          }

        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.25s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .wave-bar {
      display: inline-block;
      width: 2.5px;
      height: 4px;
      background-color: var(--brand-primary);
      border-radius: 4px;
      transition: height 0.15s ease;
    }
    .wave-bar.animating {
      animation: wave 1s ease-in-out infinite;
    }
    @keyframes wave {
      0%, 100% { height: 4px; }
      50% { height: 16px; }
    }
    .animate-pulse-light {
      animation: pulseLight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulseLight {
      0%, 100% { opacity: 1; }
      50% { opacity: .85; }
    }
  `]
})
export class ListeningStudyComponent implements OnInit, OnDestroy {
  private readonly listeningService = inject(ListeningService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  readonly tts = inject(TtsService);

  // Topic Metadata
  topicId = 0;
  isRoadmap = false;
  roadmapId: number | null = null;
  topicTitle = signal<string>('Bài học');
  topicCategory = signal<string>('A1');
  mediaUrl = signal<string>('');
  
  // Materials Panels
  transcriptText = signal<string>('');
  summaryText = signal<string>('');
  activeMaterialTab = signal<'transcript' | 'summary'>('transcript');
  
  // Show/Hide transcript state for listening practice
  showTranscript = signal<boolean>(false);

  // Sections and Questions
  sections = signal<ListeningSection[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  activeSectionId = signal<number>(0);

  // Audio Custom Player State (TTS Engine)
  isPlaying = signal(false);
  playbackSpeed = signal(1.0);

  // Quiz Engine State
  currentQuestionIndex = signal<number>(0);
  selectedOption = signal<string>('');
  quizChecked = signal<boolean>(false);
  quizIsCorrect = signal<boolean>(false);
  showResults = signal<boolean>(false);
  correctAnswersCount = signal<number>(0);
  earnedXp = signal<number>(0);

  // Parse speaker messages
  parsedDialogues = computed<ChatMessage[]>(() => {
    const text = this.transcriptText();
    if (!text) return [];

    const lines = text.split('\n');
    const result: ChatMessage[] = [];
    const speakersList: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const speaker = line.substring(0, colonIndex).trim();
        const message = line.substring(colonIndex + 1).trim();

        if (!speakersList.includes(speaker)) {
          speakersList.push(speaker);
        }
        const isLeft = speakersList.indexOf(speaker) % 2 === 0;

        result.push({ speaker, message, isLeft });
      } else {
        result.push({ speaker: '', message: line, isLeft: true });
      }
    }
    return result;
  });

  activeSection = computed(() => {
    return this.sections().find(s => s.id === this.activeSectionId());
  });

  activeQuestions = computed(() => {
    const sec = this.activeSection();
    return sec ? sec.questions : [];
  });

  currentQuestion = computed(() => {
    const list = this.activeQuestions();
    const idx = this.currentQuestionIndex();
    if (idx === -1 || list.length === 0 || idx >= list.length) return {} as ListeningQuestion;
    return list[idx];
  });

  ngOnInit() {
    this.topicId = Number(this.route.snapshot.paramMap.get('topicId'));
    const isRoadmapParam = this.route.snapshot.queryParamMap.get('isRoadmap');
    const roadmapIdParam = this.route.snapshot.queryParamMap.get('roadmapId');
    this.isRoadmap = isRoadmapParam === 'true';
    if (roadmapIdParam) {
      this.roadmapId = Number(roadmapIdParam);
    }

    if (!this.topicId) {
      this.goBack();
    } else {
      this.loadContent();
    }
  }

  ngOnDestroy() {
    this.stopAudio();
  }

  parseDescription(desc: string) {
    if (!desc) {
      this.transcriptText.set('');
      this.summaryText.set('');
      return;
    }
    
    // Split transcript and summary from text format
    const transcriptIndex = desc.toLowerCase().indexOf('transcript:');
    const summaryIndex = desc.toLowerCase().indexOf('summary:');

    let transcript = '';
    let summary = '';

    if (transcriptIndex !== -1 && summaryIndex !== -1) {
      transcript = desc.substring(transcriptIndex + 11, summaryIndex).trim();
      summary = desc.substring(summaryIndex + 8).trim();
    } else if (transcriptIndex !== -1) {
      transcript = desc.substring(transcriptIndex + 11).trim();
    } else {
      transcript = desc;
    }

    this.transcriptText.set(transcript);

    // Load full translation from map if available, otherwise fallback to database summary
    const titleKey = this.topicTitle().toLowerCase().trim();
    const fullTranslation = TRANSCRIPT_TRANSLATION_MAP[titleKey];
    if (fullTranslation) {
      this.summaryText.set(fullTranslation);
    } else {
      this.summaryText.set(summary);
    }
  }

  loadContent() {
    this.isLoading.set(true);
    this.listeningService.getTopics().subscribe({
      next: (topics) => {
        const top = topics.find(t => t.id === this.topicId);
        if (top) {
          this.topicTitle.set(top.title);
          this.topicCategory.set(top.category);
          this.mediaUrl.set(top.mediaUrl || '');
          this.parseDescription(top.description);
        }

        // Fetch detailed sections & questions
        this.listeningService.getTopicSections(this.topicId).subscribe({
          next: (data) => {
            this.sections.set(data);
            
            if (data.length > 0) {
              this.activeSectionId.set(data[0].id);
              
              // Find first uncompleted question index or set to 0
              const uncompletedIndex = data[0].questions.findIndex(q => !q.isCompleted);
              if (uncompletedIndex !== -1) {
                this.currentQuestionIndex.set(uncompletedIndex);
              } else {
                this.currentQuestionIndex.set(0);
              }
            }
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error loading sections', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading topic details', err);
        this.isLoading.set(false);
      }
    });
  }

  // --------------------------------------------------------------------
  // TTS Playback Control (using dynamic TtsService for English transcript)
  // --------------------------------------------------------------------
  togglePlay() {
    if (this.isPlaying()) {
      this.stopAudio();
    } else {
      this.isPlaying.set(true);
      const textToSpeak = this.cleanTranscriptForSpeech(this.transcriptText());
      this.tts.speak(textToSpeak, this.playbackSpeed());
      
      // Track when TTS finishes speaking
      const utterance = window.speechSynthesis;
      const checkEnd = setInterval(() => {
        if (!utterance.speaking) {
          clearInterval(checkEnd);
          this.isPlaying.set(false);
        }
      }, 250);
    }
  }

  stopAudio() {
    this.isPlaying.set(false);
    this.tts.stop();
  }

  cleanTranscriptForSpeech(text: string): string {
    if (!text) return '';
    
    // Remove "Transcript:" prefix and clean lines
    let cleaned = text.replace(/^[Tt]ranscript:\s*/i, '').trim();
    
    // Remove speaker indicators e.g., 'John:', 'Lisa:' for natural narration pauses
    cleaned = cleaned.replace(/\b([A-Z][a-zA-Z]*)\b:/g, '... $1 says, ');
    return cleaned;
  }

  cycleSpeed() {
    const current = this.playbackSpeed();
    let next = 1.0;
    if (current === 1.0) next = 1.2;
    else if (current === 1.2) next = 1.5;
    else if (current === 1.5) next = 0.8;
    this.playbackSpeed.set(next);

    if (this.isPlaying()) {
      this.tts.stop();
      const textToSpeak = this.cleanTranscriptForSpeech(this.transcriptText());
      this.tts.speak(textToSpeak, next);
    }
  }

  // Translate helper method
  translateText(text: string): string {
    if (!text) return '';
    const trimmed = text.trim();
    return TRANSLATION_MAP[trimmed] || text;
  }

  // --------------------------------------------------------------------
  // Quiz Engine Logic
  // --------------------------------------------------------------------
  selectOption(key: string) {
    if (this.quizChecked()) return;
    this.selectedOption.set(key);
  }

  checkAnswer() {
    const q = this.currentQuestion();
    const selected = this.selectedOption();
    if (!q || !selected || this.quizChecked()) return;

    this.quizChecked.set(true);
    const correct = q.correctOption || '';
    const isCorrect = selected.trim().toUpperCase() === correct.trim().toUpperCase();
    this.quizIsCorrect.set(isCorrect);

    if (isCorrect) {
      this.correctAnswersCount.update(c => c + 1);
      
      // Save progress to database
      this.isSubmitting.set(true);
      this.listeningService.completeQuestion(q.id).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.earnedXp.update(x => x + res.xpGained);

          // Update locally
          const updated = this.sections().map(s => {
            if (s.id === this.activeSectionId()) {
              const qs = s.questions.map(question => {
                if (question.id === q.id) {
                  return { ...question, isCompleted: true };
                }
                return question;
              });
              return { ...s, questions: qs };
            }
            return s;
          });
          this.sections.set(updated);
          this.toastService.success(`Correct! +${res.xpGained} EXP.`);
        },
        error: (err) => {
          console.error('Error completing question', err);
          this.isSubmitting.set(false);
        }
      });
    }
  }

  retryQuestion() {
    this.selectedOption.set('');
    this.quizChecked.set(false);
    this.quizIsCorrect.set(false);
  }

  onNextAction() {
    const questionsList = this.activeQuestions();
    const currentIndex = this.currentQuestionIndex();

    if (currentIndex < questionsList.length - 1) {
      // Clear question state & advance
      this.selectedOption.set('');
      this.quizChecked.set(false);
      this.quizIsCorrect.set(false);
      this.currentQuestionIndex.set(currentIndex + 1);
    } else {
      // Complete section & display final results
      this.isSubmitting.set(true);
      this.listeningService.completeSection(this.activeSectionId()).subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          this.earnedXp.update(x => x + res.xpGained);
          this.showResults.set(true);
          
          if (res.leveledUp) {
            this.toastService.success(`🎉 LEVEL UP: Level ${res.newLevel} (Title: ${res.newTitle})!`, 5000);
          }
        },
        error: (err) => {
          console.error('Error completing section', err);
          this.isSubmitting.set(false);
          this.showResults.set(true);
        }
      });
    }
  }

  restartQuiz() {
    this.selectedOption.set('');
    this.quizChecked.set(false);
    this.quizIsCorrect.set(false);
    this.showResults.set(false);
    this.currentQuestionIndex.set(0);
    this.correctAnswersCount.set(0);
    this.earnedXp.set(0);
    this.showTranscript.set(false);
  }

  getCompletedCount(): number {
    return this.activeQuestions().filter(q => q.isCompleted).length;
  }

  goBack() {
    this.stopAudio();
    if (this.isRoadmap && this.roadmapId) {
      this.router.navigate(['/preset-roadmap', this.roadmapId]);
    } else {
      this.router.navigate(['/listening']);
    }
  }
}
