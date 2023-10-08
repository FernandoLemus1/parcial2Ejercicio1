const calcularDescuentos = (sueldo) => {
    let renta, isss, afp;
    
    if (sueldo <= 325) {
      renta = 0;
    } else if (sueldo <= 700) {
      renta = sueldo * 0.15;
    } else if (sueldo <= 1200) {
      renta = sueldo * 0.17;
    } else if (sueldo <= 2200) {
      renta = sueldo * 0.21;
    } else if (sueldo <= 3700) {
      renta = sueldo * 0.25;
    } else {
      renta = sueldo * 0.29;
    }
    
    isss = sueldo * 0.03;
    afp = sueldo * 0.0725;
    
    const sueldoNeto = sueldo - renta - isss - afp;
    
    return { renta, isss, afp, sueldoNeto };
  };
  