import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
	getFirestore,
	doc,
	addDoc,
	getDocs,
	collection,
	updateDoc,
	
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";


const firebaseConfig = {
	apiKey: "AIzaSyAABv37MRCAKGt34GNcWuXYM14XPNMSC5Q",
	authDomain: "my-first-project-513f2.firebaseapp.com",
	projectId: "my-first-project-513f2",
	storageBucket: "my-first-project-513f2.appspot.com",
	messagingSenderId: "47101531514",
	appId: "1:47101531514:web:a5a94eb3f967ee5eeef2c3",
	measurementId: "G-FPCWJR1JDF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);


const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const logout_admin_btn = document.getElementById("logout-admin-btn");

const studentFirstname = document.getElementById("student-firstname");
const Student_ID = document.getElementById("Student_ID");
const studentEmail = document.getElementById("student-email");
const studentPassword = document.getElementById("student-password");
const studentCnic = document.getElementById("student-cnic");
const addStudentBtn = document.getElementById("add-student-btn");

const course = document.getElementById("course");
const studentId = document.getElementById("student-id");
const marks = document.getElementById("marks");
const totalMarks = document.getElementById("total-marks");
const grade = document.getElementById("grade");
const uploadMarksBtn = document.getElementById("upload-marks-btn");

loginBtn.addEventListener("click", login);

//*******************************Admin and user login function*******************************/


function login() {
	const email = loginEmail.value;
	const password = loginPassword.value;

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// Signed in
			if (email == "ayanaano5@gmail.com" && password == "1234567") {
				alert("admin login");
				document.getElementById("admin-container").style.display = "block";
				document.getElementById("login-container").style.display = "none";
			} else {
				alert("user login");
				document.getElementById("student-container").style.display = "block";
				document.getElementById("login-container").style.display = "none";
			}

			// ...
		})
		.catch((error) => {
			alert(error);
		});
}

//*******************************Add student function*******************************/
addStudentBtn.addEventListener("click", addstudent);

async function addstudent() {
	const email = studentEmail.value;
	const password = studentPassword.value;
	const student_collection = collection(db, "Student");

//*******************************create student with email and password*******************************/

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			alert("student created");
			studentFirstname.value = "";
			Student_ID.value = "";
			studentCnic.value = "";
			studentPassword.value = "";
			studentEmail.value = "";
			// ...
		})
		.catch((error) => {
			alert(error);

		});
	try {
		const obj = {
			firstname: studentFirstname.value,
			Student_ID: Student_ID.value,
			email: email,
			cnic: studentCnic.value,
		};

//*******************************Adding student data to database*******************************/

		const docRef = await addDoc(student_collection, obj);
		console.log(docRef.id);
		await addDoc(doc(db, "users", user.uid), { role: "student" });
	} catch (error) {
		console.log(error);
	}
}

const marks_collection = collection(db, "marks");
uploadMarksBtn.addEventListener("click", Addmarks);


//*******************************Adding marks to database*******************************/

async function Addmarks() {
	try {
		const docRef = await addDoc(marks_collection, {
			course: course.value,
			studentId: studentId.value,
			marks: marks.value,
			totalMarks: totalMarks.value,
			grade: grade.value,
		});
		console.log(docRef);

		alert("Student marks successfully uploaded");

		course.value = "";
		studentId.value = "";
		marks.value = "";
		totalMarks.value = "";
		grade.value = "";
	} catch (error) {
		alert(error);
	}
}



//*******************************Admin logout function*******************************//

logout_admin_btn.addEventListener("click", async () => {
	try {
		await signOut(auth);
		document.getElementById("admin-container").style.display = "none";
		document.getElementById("login-container").style.display = "block";
		alert("Admin logout successfully");
	} catch (error) {
		console.error("Error logging out: ", error.message);
	}
});


const checkResultBtn = document.getElementById("check-result-btn");
const resultDisplay = document.getElementById("result-display");
const roll_no_result = document.getElementById("rollno");

//*******************************check result function*******************************/


checkResultBtn.addEventListener("click", checkresult);
async function checkresult() {
	try {
		
		
		const rollno = roll_no_result.value;
        // const student_collection = collection(db, "Student");
		const querySnapshot = await getDocs(marks_collection);
		querySnapshot.forEach((doc) => {
			
			
			const {studentId,marks,grade,course,totalMarks} =doc.data()

			console.log("studentid===>",studentId);
			
			if (studentId == rollno) {
				resultDisplay.innerHTML=`<p><b>Course</b>:${course}<br><b>Marks</b>:${marks}<br><b>totalMarks</b>:${totalMarks}<br><b>Grade</b>:${grade}`
			} else {				
				// resultDisplay.innerHTML = "Invalid rollno! please check your roll no";
			}	 

		});

	} catch (error) {
		alert(error);
	}
}



const logoutStudentBtn = document.getElementById('logout-student-btn');

//*******************************Student logout function*******************************/

logoutStudentBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        document.getElementById('student-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        alert("Student logged out successfully.");
    } catch (error) {
        alert(error)
    }
});


// DOM Elements for Profile Update
const profileFirstname = document.getElementById('profile-firstname');
const profileLastname = document.getElementById('profile-lastname');
const profileCnic = document.getElementById('profile-cnic');
const updateProfileBtn = document.getElementById('update-profile-btn');
const updateProfileMessage = document.getElementById('update-profile-message');
const student_collection=collection(db,"Student")
// Update Profile Function
updateProfileBtn.addEventListener('click', async () => {
    try {
        // Get the currently signed-in user
        const user = auth.currentUser;
		console.log(user);
		
        if (user) {
            // Reference to the student's Firestore document
            const studentRef = doc(db,"Student", user.uid);

			console.log(studentRef);
			
            
            // Update the student's profile in Firestore
            await updateDoc(studentRef, {
                firstname: profileFirstname.value,
                lastname: profileLastname.value,
                cnic: profileCnic.value
            });
            
            updateProfileMessage.innerText = "Profile updated successfully!";
        } else {
            updateProfileMessage.innerText = "No user is logged in.";
        }
    } catch (error) {
        console.error("Error updating profile: ", error.message);
        updateProfileMessage.innerText = "Error updating profile: " + error.message;
    }
});
