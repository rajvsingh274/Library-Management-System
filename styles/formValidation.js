function phoneValidate(){
    var phone=document.getElementById("phone").value;
    var phone1=Number(phone);
    var n=phone.length;
    var v=Number.isInteger(phone1);
    var id=document.getElementById( "addU").value;
    id=Number(id);
    if (v==false || n!=10){
        alert("Invalid Mobile number");
        return false;
    }
    if(id>10000) {
        alert("ID out of range");return false;
    }
}
function validateIssueId(){
    var id=document.getElementById( "delete_issue_id").value;
    id=Number(id);
    if (id>=10000){
        alert("ID out of range");
    }
}
function validateBookId(){
    var id=document.getElementById( "delete_book_id").value;
    id=Number(id);
    if (id>=10000){
        alert("ID out of range");
    }
}
function validateStudentId(){
    var id=document.getElementById( "delete_student_id").value;
    id=Number(id);
    if (id>=10000){
        alert("ID out of range");
    }
}