import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SearchableSelectComponent } from './searchable-select.component';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, SearchableSelectComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  surveyForm: FormGroup;
  loginForm: FormGroup;
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  
  showLoginModal = signal(false);
  isAdminLoggedIn = signal(false);
  loginError = signal('');
  
  submittedSurveys = signal<any[]>([]);

  // Mock Data
  states = [
    { label: 'Andaman and Nicobar Islands', value: 'AN' },
    { label: 'Andhra Pradesh', value: 'AP' },
    { label: 'Arunachal Pradesh', value: 'AR' },
    { label: 'Assam', value: 'AS' },
    { label: 'Bihar', value: 'BR' },
    { label: 'Chandigarh', value: 'CH' },
    { label: 'Chhattisgarh', value: 'CG' },
    { label: 'Dadra and Nagar Haveli and Daman and Diu', value: 'DN' },
    { label: 'Delhi', value: 'DL' },
    { label: 'Goa', value: 'GA' },
    { label: 'Gujarat', value: 'GJ' },
    { label: 'Haryana', value: 'HR' },
    { label: 'Himachal Pradesh', value: 'HP' },
    { label: 'Jammu and Kashmir', value: 'JK' },
    { label: 'Jharkhand', value: 'JH' },
    { label: 'Karnataka', value: 'KA' },
    { label: 'Kerala', value: 'KL' },
    { label: 'Ladakh', value: 'LA' },
    { label: 'Lakshadweep', value: 'LD' },
    { label: 'Madhya Pradesh', value: 'MP' },
    { label: 'Maharashtra', value: 'MH' },
    { label: 'Manipur', value: 'MN' },
    { label: 'Meghalaya', value: 'ML' },
    { label: 'Mizoram', value: 'MZ' },
    { label: 'Nagaland', value: 'NL' },
    { label: 'Odisha', value: 'OR' },
    { label: 'Puducherry', value: 'PY' },
    { label: 'Punjab', value: 'PB' },
    { label: 'Rajasthan', value: 'RJ' },
    { label: 'Sikkim', value: 'SK' },
    { label: 'Tamil Nadu', value: 'TN' },
    { label: 'Telangana', value: 'TG' },
    { label: 'Tripura', value: 'TR' },
    { label: 'Uttar Pradesh', value: 'UP' },
    { label: 'Uttarakhand', value: 'UK' },
    { label: 'West Bengal', value: 'WB' }
  ];

  districtMap: Record<string, {label: string, value: string}[]> = {
    'AN': ['Nicobar', 'North and Middle Andaman', 'South Andaman'].map(d => ({label: d, value: d})),
    'AP': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR District', 'Kadapa'].map(d => ({label: d, value: d})),
    'AR': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kurung Kumey', 'Kra Daadi', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Upper Siang', 'Lower Siang', 'Lower Dibang Valley', 'Dibang Valley', 'Anjaw', 'Lohit', 'Namsai', 'Changlang', 'Tirap', 'Longding'].map(d => ({label: d, value: d})),
    'AS': ['Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang', 'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat', 'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup Metropolitan', 'Kamrup', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'].map(d => ({label: d, value: d})),
    'BR': ['Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'].map(d => ({label: d, value: d})),
    'CH': ['Chandigarh'].map(d => ({label: d, value: d})),
    'CG': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Kondagaon', 'Korba', 'Koriya', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sukma', 'Surajpur', 'Surguja'].map(d => ({label: d, value: d})),
    'DN': ['Dadra and Nagar Haveli', 'Daman', 'Diu'].map(d => ({label: d, value: d})),
    'DL': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'].map(d => ({label: d, value: d})),
    'GA': ['North Goa', 'South Goa'].map(d => ({label: d, value: d})),
    'GJ': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'].map(d => ({label: d, value: d})),
    'HR': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'].map(d => ({label: d, value: d})),
    'HP': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'].map(d => ({label: d, value: d})),
    'JK': ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'].map(d => ({label: d, value: d})),
    'JH': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'].map(d => ({label: d, value: d})),
    'KA': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'].map(d => ({label: d, value: d})),
    'KL': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'].map(d => ({label: d, value: d})),
    'LA': ['Kargil', 'Leh'].map(d => ({label: d, value: d})),
    'LD': ['Lakshadweep'].map(d => ({label: d, value: d})),
    'MP': ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'].map(d => ({label: d, value: d})),
    'MH': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'].map(d => ({label: d, value: d})),
    'MN': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong', 'Tengnoupal', 'Thoubal', 'Ukhrul'].map(d => ({label: d, value: d})),
    'ML': ['East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills', 'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'].map(d => ({label: d, value: d})),
    'MZ': ['Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Saitual', 'Serchhip'].map(d => ({label: d, value: d})),
    'NL': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'].map(d => ({label: d, value: d})),
    'OR': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'].map(d => ({label: d, value: d})),
    'PY': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'].map(d => ({label: d, value: d})),
    'PB': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'Tarn Taran'].map(d => ({label: d, value: d})),
    'RJ': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'].map(d => ({label: d, value: d})),
    'SK': ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'].map(d => ({label: d, value: d})),
    'TN': ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'].map(d => ({label: d, value: d})),
    'TG': ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal (Rural)', 'Warangal (Urban)', 'Yadadri Bhuvanagiri'].map(d => ({label: d, value: d})),
    'TR': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'].map(d => ({label: d, value: d})),
    'UP': ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'].map(d => ({label: d, value: d})),
    'UK': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'].map(d => ({label: d, value: d})),
    'WB': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'].map(d => ({label: d, value: d})),
  };

  selectedState = signal<string>('');
  selectedDistrict = signal<string>('');
  selectedAssembly = signal<string>('');
  selectedBooth = signal<string>('');

  districts = computed(() => {
    const state = this.selectedState();
    if (state) {
      return this.districtMap[state] || [];
    }
    
    // If no state selected, return all districts
    const allDistricts: {label: string, value: string}[] = [];
    for (const dists of Object.values(this.districtMap)) {
      allDistricts.push(...dists);
    }
    // Sort alphabetically
    return allDistricts.sort((a, b) => a.label.localeCompare(b.label));
  });

  assemblies = computed(() => {
    const district = this.selectedDistrict();
    if (!district) return [];
    if (district === 'Jodhpur') {
      return [
        { label: 'Sardarpura (122)', value: '122' },
        { label: 'Soorsagar (123)', value: '123' },
        { label: 'Luni (124)', value: '124' },
        { label: 'Jodhpur (125)', value: '125' },
        { label: 'Phalodi (126)', value: '126' },
      ];
    }
    return [
      { label: `${district} Assembly 1`, value: `${district}_A1` },
      { label: `${district} Assembly 2`, value: `${district}_A2` },
      { label: `${district} Assembly 3`, value: `${district}_A3` },
    ];
  });

  pollingBooths = computed(() => {
    const assembly = this.selectedAssembly();
    if (!assembly) return [];
    return [
      { label: `Booth 1 - Govt School (${assembly})`, value: `${assembly}_B1` },
      { label: `Booth 2 - Panchayat Bhawan (${assembly})`, value: `${assembly}_B2` },
      { label: `Booth 3 - Community Hall (${assembly})`, value: `${assembly}_B3` },
      { label: `Booth 4 - Primary School (${assembly})`, value: `${assembly}_B4` },
      { label: `Booth 5 - Health Center (${assembly})`, value: `${assembly}_B5` },
    ];
  });

  areas = computed(() => {
    const booth = this.selectedBooth();
    if (!booth) return [];
    return [
      { label: `Area 1 - North (${booth})`, value: `${booth}_A1` },
      { label: `Area 2 - South (${booth})`, value: `${booth}_A2` },
      { label: `Area 3 - East (${booth})`, value: `${booth}_A3` },
      { label: `Area 4 - West (${booth})`, value: `${booth}_A4` },
    ];
  });

  categories = [
    { label: 'General', value: 'GEN' },
    { label: 'OBC', value: 'OBC' },
    { label: 'SC', value: 'SC' },
    { label: 'ST', value: 'ST' },
    { label: 'Minority', value: 'MIN' },
  ];

  genders = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];

  occupations = [
    { label: 'Student', value: 'STUDENT' },
    { label: 'Employed', value: 'EMPLOYED' },
    { label: 'Business', value: 'BUSINESS' },
    { label: 'Farmer', value: 'FARMER' },
    { label: 'Housewife', value: 'HOUSEWIFE' },
    { label: 'Unemployed', value: 'UNEMPLOYED' },
  ];

  educations = [
    { label: 'Illiterate', value: 'ILLITERATE' },
    { label: 'Primary', value: 'PRIMARY' },
    { label: 'Secondary', value: 'SECONDARY' },
    { label: 'Higher Secondary', value: 'HIGHER_SECONDARY' },
    { label: 'Graduate', value: 'GRADUATE' },
    { label: 'Post Graduate', value: 'POST_GRADUATE' },
  ];

  ageGroups = [
    { label: '18-25', value: '18-25' },
    { label: '26-35', value: '26-35' },
    { label: '36-45', value: '36-45' },
    { label: '46-60', value: '46-60' },
    { label: '60+', value: '60+' },
  ];

  issues = [
    { label: 'Water', value: 'WATER' },
    { label: 'Road', value: 'ROAD' },
    { label: 'Electricity', value: 'ELECTRICITY' },
    { label: 'Employment', value: 'EMPLOYMENT' },
    { label: 'Education', value: 'EDUCATION' },
    { label: 'Health', value: 'HEALTH' },
    { label: 'Law & Order', value: 'LAW_ORDER' },
    { label: 'Corruption', value: 'CORRUPTION' },
  ];

  opinions = [
    { label: 'Excellent', value: 'EXCELLENT' },
    { label: 'Good', value: 'GOOD' },
    { label: 'Average', value: 'AVERAGE' },
    { label: 'Poor', value: 'POOR' },
    { label: 'Very Poor', value: 'VERY_POOR' },
  ];

  yesNo = [
    { label: 'Yes', value: 'YES' },
    { label: 'No', value: 'NO' },
  ];

  votingBases = [
    { label: 'Party', value: 'PARTY' },
    { label: 'Candidate', value: 'CANDIDATE' },
    { label: 'Caste', value: 'CASTE' },
    { label: 'CM Face', value: 'CM_FACE' },
    { label: 'Local Issues', value: 'LOCAL_ISSUES' },
  ];

  parties = [
    { label: 'BJP', value: 'BJP' },
    { label: 'INC', value: 'INC' },
    { label: 'RLP', value: 'RLP' },
    { label: 'BSP', value: 'BSP' },
    { label: 'AAP', value: 'AAP' },
    { label: 'Independent', value: 'IND' },
    { label: 'NOTA', value: 'NOTA' },
  ];

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      adminId: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.surveyForm = this.fb.group({
      // Location Details
      stateCode: ['', Validators.required],
      districtName: ['', Validators.required],
      assemblyName: ['', Validators.required],
      pollingBooth: ['', Validators.required],
      area: ['', Validators.required],

      // Respondent Bio Data
      surveyorId: ['', Validators.required],
      surveyorName: ['', Validators.required],
      serialNumber: [''],
      vsnId: [''],
      voterId: [''],
      houseNumber: [''],
      voterSerialNumber: [''],
      respondentName: ['', Validators.required],

      // Personal Information
      category: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      education: ['', Validators.required],
      ageGroup: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],

      // Survey Questions
      majorIssue: ['', Validators.required],
      opinionCentral: ['', Validators.required],
      opinionState: ['', Validators.required],
      opinionMLA: ['', Validators.required],
      reasonDissatisfaction: [''],
      candidateReligion: ['', Validators.required],
      candidateSelection: [''],
      votingBasis: ['', Validators.required],
      preferredParty: ['', Validators.required],
      preferredMLA: [''],
      developmentNeeds: [''],
    });

    // Handle dependent dropdowns and auto-selection
    this.surveyForm.get('stateCode')?.valueChanges.subscribe(state => {
      this.selectedState.set(state || '');
      const districtCtrl = this.surveyForm.get('districtName');
      const currentDistrict = districtCtrl?.value;
      if (state && currentDistrict) {
        // Check if current district belongs to the new state
        const isValid = this.districtMap[state]?.some(d => d.value === currentDistrict);
        if (!isValid) {
          districtCtrl?.setValue('');
        }
      }
    });

    this.surveyForm.get('districtName')?.valueChanges.subscribe(district => {
      this.selectedDistrict.set(district || '');
      const assemblyCtrl = this.surveyForm.get('assemblyName');
      if (district) {
        const currentState = this.surveyForm.get('stateCode')?.value;
        if (!currentState) {
          // Find state for this district
          for (const [stateCode, dists] of Object.entries(this.districtMap)) {
            if (dists.some(d => d.value === district)) {
              this.surveyForm.get('stateCode')?.setValue(stateCode);
              break;
            }
          }
        }
        
        // Auto-select the first assembly if available and not already valid
        const validAssemblies = this.assemblies();
        if (validAssemblies.length > 0 && (!assemblyCtrl?.value || !validAssemblies.some(a => a.value === assemblyCtrl?.value))) {
          assemblyCtrl?.setValue(validAssemblies[0].value);
        }
      } else {
        assemblyCtrl?.setValue('');
      }
    });

    this.surveyForm.get('assemblyName')?.valueChanges.subscribe(assembly => {
      this.selectedAssembly.set(assembly || '');
      const boothCtrl = this.surveyForm.get('pollingBooth');
      if (assembly) {
        const validBooths = this.pollingBooths();
        // Auto-select the first polling booth if available and not already valid
        if (validBooths.length > 0 && (!boothCtrl?.value || !validBooths.some(b => b.value === boothCtrl?.value))) {
          boothCtrl?.setValue(validBooths[0].value);
        }
      } else {
        boothCtrl?.setValue('');
      }
    });

    this.surveyForm.get('pollingBooth')?.valueChanges.subscribe(booth => {
      this.selectedBooth.set(booth || '');
      const areaCtrl = this.surveyForm.get('area');
      if (booth) {
        const validAreas = this.areas();
        // Auto-select the first area if available and not already valid
        if (validAreas.length > 0 && (!areaCtrl?.value || !validAreas.some(a => a.value === areaCtrl?.value))) {
          areaCtrl?.setValue(validAreas[0].value);
        }
      } else {
        areaCtrl?.setValue('');
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.surveyForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      this.isSubmitting.set(true);
      // Simulate API call
      setTimeout(() => {
        const formData = this.surveyForm.value;
        this.submittedSurveys.update(surveys => [{
          ...formData,
          id: Date.now(),
          timestamp: new Date()
        }, ...surveys]);
        
        console.log('Form Data:', formData);
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.surveyForm.reset();
        
        setTimeout(() => {
          this.submitSuccess.set(false);
        }, 3000);
      }, 1500);
    } else {
      this.surveyForm.markAllAsTouched();
      // Scroll to first error (simplified)
      const firstInvalidControl = document.querySelector('.ng-invalid');
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  onClear() {
    if (confirm('Are you sure you want to clear the form?')) {
      this.surveyForm.reset();
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { adminId, password } = this.loginForm.value;
      // Simple hardcoded check for demonstration
      if (adminId === 'admin' && password === 'admin123') {
        this.isAdminLoggedIn.set(true);
        this.showLoginModal.set(false);
        this.loginError.set('');
        this.loginForm.reset();
      } else {
        this.loginError.set('Invalid Admin ID or Password');
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  downloadExcel() {
    const surveys = this.submittedSurveys();
    if (surveys.length === 0) return;

    // Define headers
    const headers = [
      'Date', 'Surveyor ID', 'Surveyor Name', 'Respondent Name', 'Contact Number',
      'State', 'District', 'Assembly', 'Polling Booth', 'Area',
      'Category', 'Gender', 'Age Group', 'Education', 'Occupation',
      'Major Issue', 'Preferred Party', 'Voting Basis'
    ];

    // Map data to rows
    const rows = surveys.map(s => [
      new Date(s.timestamp).toLocaleString(),
      s.surveyorId, s.surveyorName, s.respondentName, s.contactNumber,
      s.stateCode, s.districtName, s.assemblyName, s.pollingBooth, s.area,
      s.category, s.gender, s.ageGroup, s.education, s.occupation,
      s.majorIssue, s.preferredParty, s.votingBasis
    ]);

    // Create CSV content with BOM for Excel UTF-8 support
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `survey_data_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
