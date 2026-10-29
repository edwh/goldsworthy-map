// OS grid ref -> WGS84 (Airy 1830 inverse TM + Helmert)
export function gridToEN(ref){ const s=ref.replace(/\s/g,'').toUpperCase(); const L='ABCDEFGHJKLMNOPQRSTUVWXYZ';
  let l1=L.indexOf(s[0]), l2=L.indexOf(s[1]);
  let e100=((l1-2)%5)*5+(l2%5), n100=(19-Math.floor(l1/5)*5)-Math.floor(l2/5);
  const d=s.slice(2), h=d.length/2; const pad=x=>parseFloat(x.padEnd(5,'5'));
  return [e100*100000+pad(d.slice(0,h)), n100*100000+pad(d.slice(h))]; }
export function enToLatLon(E,N){ const a=6377563.396,b=6356256.909,F0=0.9996012717,φ0=49*Math.PI/180,λ0=-2*Math.PI/180,N0=-100000,E0=400000;
  const e2=1-b*b/(a*a), n=(a-b)/(a+b); let φ=φ0, M=0;
  do{ φ=(N-N0-M)/(a*F0)+φ;
    M=b*F0*((1+n+5/4*n*n+5/4*n**3)*(φ-φ0)-(3*n+3*n*n+21/8*n**3)*Math.sin(φ-φ0)*Math.cos(φ+φ0)+(15/8*n*n+15/8*n**3)*Math.sin(2*(φ-φ0))*Math.cos(2*(φ+φ0))-(35/24*n**3)*Math.sin(3*(φ-φ0))*Math.cos(3*(φ+φ0)));
  } while(Math.abs(N-N0-M)>=0.00001);
  const s=Math.sin(φ),c=Math.cos(φ),t=Math.tan(φ); const ν=a*F0/Math.sqrt(1-e2*s*s), ρ=a*F0*(1-e2)/Math.pow(1-e2*s*s,1.5), η2=ν/ρ-1;
  const VII=t/(2*ρ*ν),VIII=t/(24*ρ*ν**3)*(5+3*t*t+η2-9*t*t*η2),IX=t/(720*ρ*ν**5)*(61+90*t*t+45*t**4);
  const X=1/(c*ν),XI=1/(c*6*ν**3)*(ν/ρ+2*t*t),XII=1/(c*120*ν**5)*(5+28*t*t+24*t**4),XIIA=1/(c*5040*ν**7)*(61+662*t*t+1320*t**4+720*t**6);
  const dE=E-E0; const lat=φ-VII*dE**2+VIII*dE**4-IX*dE**6, lon=λ0+X*dE-XI*dE**3+XII*dE**5-XIIA*dE**7;
  // Helmert OSGB36 -> WGS84
  let sφ=Math.sin(lat),cφ=Math.cos(lat),v=a/Math.sqrt(1-e2*sφ*sφ);
  let x=v*cφ*Math.cos(lon),y=v*cφ*Math.sin(lon),z=(1-e2)*v*sφ;
  const tx=446.448,ty=-125.157,tz=542.06,sc=-20.4894e-6,rx=0.1502/3600*Math.PI/180,ry=0.247/3600*Math.PI/180,rz=0.8421/3600*Math.PI/180;
  const x2=tx+(1+sc)*x-rz*y+ry*z, y2=ty+rz*x+(1+sc)*y-rx*z, z2=tz-ry*x+rx*y+(1+sc)*z;
  const A=6378137,B=6356752.3142,e22=1-B*B/(A*A); const p=Math.hypot(x2,y2); let φ2=Math.atan2(z2,p*(1-e22)),φp;
  do{ φp=φ2; const vv=A/Math.sqrt(1-e22*Math.sin(φ2)**2); φ2=Math.atan2(z2+e22*vv*Math.sin(φ2),p);}while(Math.abs(φ2-φp)>1e-12);
  return [+(φ2*180/Math.PI).toFixed(5), +(Math.atan2(y2,x2)*180/Math.PI).toFixed(5)]; }
export const g=ref=>enToLatLon(...gridToEN(ref));
