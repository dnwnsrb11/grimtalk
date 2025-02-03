const formatDate = (data) => {
    const dataString = String(data);
    const datePart = dataString.split('T'); 
    const formattedDate = datePart[0]?.replaceAll('-', '.') || ''; 
    return formattedDate;
  };