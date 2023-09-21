import { AxiosError } from 'axios';
import { Dialog, Notify, PromptInputType, QNotifyCreateOptions } from 'quasar';



interface optionsErrorEx {
  timeout?: number;
  position?: QNotifyCreateOptions['position'];
  mensaje?: string;
}

const showErrorEx = (
  //q: typeof useQuasar,
  ex: AxiosError,
  { timeout = 5000, position = 'center', mensaje= undefined }: optionsErrorEx = {
    timeout: 5000,
    position: 'center',
  }
) => {
  //console.log('datos', ex.response);
  try {
    if (position.toString().trim() === '') {
      position = 'center';
    }
    let msg = '';
    let msgEx = '';
    let isHtml = false;
    if(!ex){
      return;
    }

    if (!ex.response) {
      //msg = 'Error: Network Error';
      //msgEx = 'Por favor contacte al administrador';
      const newex = ex as Error;
      msg = newex.name;
      msgEx =
        newex.message +
        (newex.message === 'Network Error' ? '. Por favor contacte al administrador' : '');
      console.log(newex.message, newex.name, '  ');
    } else if (ex.response.data === '') {
      
      msg = ex.response.status.toString();
      msgEx = ex.response.statusText;
    } else if ((!ex.response.data as any).Message) {
      msg = ex.response.status.toString();
      msgEx = ex.response.data as any;
      const t = (ex.response.data as any).toString();

      if (t.includes('!DOCTYPE html')) {
        isHtml = true;
      }
      timeout = 10000;
    } else if((ex.response.data as any).Message) {

      msg = (ex.response.data as any).ExceptionMessage ?? (ex.response.data as any).MessageDetail;
      msgEx = (ex.response.data as any).Message;
      msgEx=msgEx??'';
    }
    else if(ex.response.status!==200){
      msg=ex.response.status.toString();
      msgEx=ex.response.statusText;
    }


    if (!isHtml && msgEx.length > 150 && timeout <= 5000) {
      timeout = 8000;
    }
    if (!isHtml && msgEx.length > 300 && timeout <= 8000) {
      timeout = 10000;
    }

    if(mensaje!==undefined){
      msg=mensaje+': '+msg;
    }

    Notify.create({
      message: msg,
      caption: msgEx,
      position: position,
      type: 'negative',
      color: isHtml ? '' : 'negative',
      timeout: timeout,
      //multiLine: true,
      html: isHtml,
      actions: [
        {
          label: 'Ok',
          color: 'white',
          handler: () => {
            /* ... */
          },
        },
      ],
    });
    //console.log(msg, msgEx);
    // q.notify({
    //   message: msg,
    //   caption: msgEx,
    //   position: position,
    //   type: 'negative',
    //   color: isHtml ? '' : 'negative',
    //   timeout: timeout,
    //   //multiLine: true,
    //   html: isHtml,
    //   actions: [
    //     {
    //       label: 'Ok',
    //       color: 'white',
    //       handler: () => {
    //         /* ... */
    //       },
    //     },
    //   ],
    // });
  } catch (error) {
    console.log(error, ex);
  }
};

interface optionsError {
  subtitulo?: string;
  timeout?: number;
  position?: QNotifyCreateOptions['position'];
}

const showError = (
  //q = useQuasar,
  titulo: string,
  { subtitulo = '', timeout = 5000, position = 'center' }: optionsError = {}
) => {
  try {
    if (position.toString().trim() === '') {
      position = 'center';
    }
    Notify.create({
      message: titulo,
      caption: subtitulo,
      position: position,
      type: 'negative',
      timeout: timeout,
      actions: [
        {
          label: 'Ok',
          color: 'white',
          handler: () => {
            /* ... */
          },
        },
      ],
    });
    // q.notify({
    //   message: titulo,
    //   caption: subtitulo,
    //   position: position,
    //   type: 'negative',
    //   timeout: timeout,
    //   actions: [
    //     {
    //       label: 'Ok',
    //       color: 'white',
    //       handler: () => {
    //         /* ... */
    //       },
    //     },
    //   ],
    // });
  } catch (error) {
    console.log(error);
  }
};

// interface myoptions extends QNotifyCreateOptions{
//   msg: string
//   positon:
// }

interface optionsAlert {
  subtitulo?: string;
  timeout?: number;
  position?: QNotifyCreateOptions['position'];
  tipo?: string;
  color?: string;
  showBadge?:boolean;
}
const showSucces = (
  //data: myoptions,
  //q = useQuasar,
  msg: string,
  {
    subtitulo = '',
    timeout = 2500,
    position = 'center',
    tipo = 'positive',
    color = '',
    showBadge=true,
  }: optionsAlert = {}
) => {
  try {
    if (position.toString().trim() === '') {
      position = 'center';
    }
    let isHtml = false;

    if (msg.includes('<!DOCTYPE html>')) {
      isHtml = true;
    }
    let classBadge:string|undefined=undefined;
    if (!showBadge) {
      //console.log('si');

      classBadge='opacity: 0'
    }
    Notify.create({
      type: tipo,
      color: color === '' ? tipo : color,
      message: msg,
      caption: subtitulo,
      position: position,
      timeout: timeout,
      html: isHtml,
      badgeStyle: classBadge,
      actions: [
        {
          label: 'Ok',
          color: 'white',
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};



interface onPressAlert {
  onPressOk?: ()=>void|Promise<void>,
  onPressCancel?: ()=>void|Promise<void>
}

const showAlert = (
  //q = useQuasar,
  titulo = '',
  mensaje = '',
  { onPressOk=undefined, onPressCancel=undefined }:onPressAlert
) => {
  try {
    let cancelBtn = true;
    if (onPressCancel === null) {
      cancelBtn = false;
    }

    Dialog.create({
      title: titulo,
      message: mensaje,
      persistent: true,
      ok: {
        push: true,
        label: 'Aceptar',
      },
      cancel: !cancelBtn
        ? false
        : {
            push: false,
            color: 'negative',
            label: 'Cancelar',
          },
    })
      .onOk(() => {
        if (onPressOk !== undefined) {
          void onPressOk();
        }
      })
      .onCancel(() => {
        if (onPressCancel !== undefined) {
          void onPressCancel();
        }
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });

    // q.dialog({
    //   title: titulo,
    //   message: mensaje,
    //   persistent: true,
    //   ok: {
    //     push: true,
    //     label: 'Aceptar',
    //   },
    //   cancel: !cancelBtn
    //     ? false
    //     : {
    //         push: false,
    //         color: 'negative',
    //         label: 'Cancelar',
    //       },
    // })
    //   .onOk(onPressOk)
    //   .onCancel(onPressCancel)
    //   .onDismiss(() => {
    //     // console.log('I am triggered on both OK and Cancel')
    //   });
  } catch (error) {
    console.log(error);
  }
};

const showAlertAsync=(
  titulo = '',
  mensaje = '',
  { onPressOk=undefined, onPressCancel=undefined }:onPressAlert
)=>{

  return new Promise<boolean>((resolve, reject)=>{
    let cancelBtn = true;
    if (onPressCancel === null) {
      cancelBtn = false;
    }

    Dialog.create({
      title: titulo,
      message: mensaje,
      persistent: true,
      ok: {
        push: true,
        label: 'Aceptar',
      },
      cancel: !cancelBtn
        ? false
        : {
            push: false,
            color: 'negative',
            label: 'Cancelar',
          },
    })
      .onOk(
        () => {
        if (onPressOk !== undefined) {
          void onPressOk();
        }
        resolve(true);
      }
      )
      .onCancel(
        //onPressCancel
        () => {
        if (onPressCancel !== undefined) {
          void onPressCancel();
        }
        //reject('');
        resolve(false);
      }
      )
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  })
  // return new Promise((resolve, reject) => {
  // //this.$q.dialog(...).onOk(resolve).onCancel(reject)
  // }
};


//type ValType = number | boolean;



const inputBox= <T>(titulo: string, mensaje: string, tipo?: 'number'| 'password'|'text', modelo?:string|null, persistent=true): Promise<T|null>=>{
  //try {yr
    let newTipo='';
    if (tipo===undefined) {
      newTipo='text';
    }
    else{
      newTipo=tipo.toString();
    }

    const p= new Promise<T|null>((resolve, reject) => {
      Dialog.create({

        title: titulo,
        message: mensaje,
        prompt: {
          model: modelo??'',
          type: newTipo as PromptInputType, // optional
        },
        cancel: true,
        persistent: persistent
      }).onOk(data => {
        resolve(data);
      }).onCancel(() => {
        // console.log('>>>> Cancel')
        //reject();
        resolve(null as any);
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    });
    return p;

  // } catch (error) {
  //   console.log(error);
  //   return '';
  // }
}



export { showError, showSucces, showErrorEx, showAlert, inputBox,showAlertAsync };
